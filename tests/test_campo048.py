"""Smoke test for the standalone Campo 06, serving it on loopback."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os
from pathlib import Path
from threading import Thread

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / 'play' / 'Ilha_Viva_Campo_06.html'


def main():
    assert HTML.is_file(), 'O pipeline deve gerar o Campo 06 autossuficiente'
    handler = partial(SimpleHTTPRequestHandler, directory=HTML.parent)
    with ThreadingHTTPServer(('127.0.0.1', 0), handler) as server:
        Thread(target=server.serve_forever, daemon=True).start()
        try:
            verify(server.server_port)
        finally:
            server.shutdown()


def verify(port):
    origin = f'http://127.0.0.1:{port}'
    external = []
    errors = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH'))
        context = browser.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)

        def route(request):
            if request.request.url.startswith(origin + '/'):
                request.continue_()
            else:
                external.append(request.request.url)
                request.abort()

        context.route('http*://**', route)
        page = context.new_page()
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(f'{origin}/Ilha_Viva_Campo_05.html')
        page.wait_for_function('window.field')
        page.evaluate('field.setAuto(false); field.p.food = 61')
        page.locator('#save').click()
        assert page.evaluate("JSON.parse(localStorage.getItem('iv046_field')).version === 46")
        page.goto(f'{origin}/{HTML.name}')
        page.wait_for_function('window.field && Object.values(sprites).every(i => i.complete && i.naturalWidth)')
        page.evaluate('field.setAuto(false)')
        context.set_offline(True)
        assert page.title() == 'Ilha Viva | Campo 06'
        assert page.locator('#homestead').count() == 1
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        page.locator('#load').click()
        assert page.evaluate('field.p.food === 61 && field.homestead != null')
        page.locator('#save').click()
        assert page.evaluate("JSON.parse(localStorage.getItem('iv048_field')).version === 48")
        assert page.evaluate("JSON.parse(localStorage.getItem('iv046_field')).version === 46")
        page.evaluate('field.newWorld(); field.setAuto(false); field.p.food = 61')
        exercise_controls(page)
        for corrupt in ('data.farm.seedStore.beans = -1', 'data.p.dir = "missing"'):
            page.locator('#save').click()
            page.evaluate(f"""() => {{
                const data = JSON.parse(localStorage.getItem('iv048_field'));
                {corrupt};
                data.p.food = 55;
                localStorage.setItem('iv048_field', JSON.stringify(data));
            }}""")
            page.locator('#load').click()
            assert 'compatível' in page.locator('#log').inner_text()
            assert page.evaluate('field.p.food === 97 && field.p.dir === "right"')
        assert not errors, errors
        assert not external, external
        print('Campo 06: inicialização, layout móvel, acesso offline e migração de save verificadas.')
        browser.close()


def exercise_controls(page):
    page.locator('#homestead summary').click()
    assert page.locator('#farmCommand').is_visible()

    def aim(kind, exclude=()):
        return page.evaluate("""([kind, excluded]) => {
            for (const [i,c] of field.s.cells.entries()) {
                if (excluded.includes(i) || (kind === 'river' ? !c.channel || c.surface < 4 :
                    c.channel || c.surface > 3 || c.b > .16)) continue;
                const y = (c.y+.5)*50, x = (c.x+.5)*72-72*.65;
                if (x < 5 || waterAt(x,y) || field.collision(x,y,x-10,y)) continue;
                Object.assign(field.p,{x,y,dir:'right'});
                if (field.target() !== c) continue;
                return i;
            }
            throw Error('No matching target');
        }""", [kind, list(exclude)])

    def recipe(key):
        page.locator('#recipe').select_option(key)
        page.locator('#craft').click()

    def place(key):
        page.locator('#structure').select_option(key)
        page.locator('#place').click()

    def farm_command(key):
        page.locator('#farmCommand').select_option(key)
        page.locator('#farmApply').click()

    chest = aim('land')
    recipe('mallet')
    recipe('chest')
    place('chest')
    assert page.evaluate('i=>field.homestead.objects[i]?.kind==="chest"', chest)
    assert page.evaluate("""i=>{
        const c=field.s.cells[i],q=Homestead.shape('chest',c.x,c.y,72,50);
        return field.collision(q.x,q.y,q.x-42,q.y);
    }""", chest)

    page.locator('#storageItem').select_option('wood')
    page.locator('#storeItem').click()
    assert page.evaluate('i=>field.homestead.objects[i].stock.wood===1', chest)
    farm_command('seedDeposit')
    assert page.evaluate('field.farm.seedStore.beans===1')
    page.locator('#save').click()
    page.evaluate('i=>{field.homestead.objects[i].stock.wood=0;field.farm.seedStore={}}', chest)
    page.locator('#load').click()
    assert page.evaluate('i=>field.homestead.objects[i].stock.wood===1 && field.farm.seedStore.beans===1', chest)
    page.locator('#takeItem').click()
    farm_command('seedWithdraw')
    assert page.evaluate('i=>field.homestead.objects[i].stock.wood===0 && !field.farm.seedStore.beans', chest)

    fire = aim('land', [chest])
    recipe('cookfire')
    place('cookfire')
    assert page.evaluate('i=>field.homestead.objects[i]?.kind==="cookfire"', fire)
    river = aim('river')
    before_water = page.evaluate('i=>field.s.cells[i].surface', river)
    page.locator('#collectRaw').click()
    assert page.evaluate('i=>field.s.cells[i].surface', river) == before_water - 4
    assert page.evaluate('field.p.bag.raw_water===1')
    assert aim('land', [chest]) == fire
    recipe('treat_water')
    assert page.evaluate('field.p.bag.raw_water===0 && field.p.bag.water===6')
    page.evaluate("Farm.add(field.p.bag,'beans',2)")
    recipe('cook_beans')
    assert page.evaluate('field.p.bag.meal===1')
    page.locator('#foodChoice').select_option('meal')
    page.locator('#eat').click()
    assert page.evaluate('field.p.bag.meal===0 && field.p.food===97')

    plot = aim('land', [chest, fire])
    page.locator('[data-act=hoe]').click()
    page.evaluate('field.move(1)')
    assert page.evaluate('i=>!!field.farm.plots[i]', plot)
    page.locator('[data-act=seed]').click()
    page.evaluate('field.move(1)')
    assert page.evaluate('i=>field.farm.plots[i].crop==="beans"', plot)
    assert 'atividade microbiana' in page.locator('#soilStatus').inner_text()
    print('Campo 06: controles móveis de plantio, fabricação, construção, colisão, baú, sementes, água e refeições.')


if __name__ == '__main__':
    main()
