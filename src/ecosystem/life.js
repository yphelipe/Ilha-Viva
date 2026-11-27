/* neutral hereditary markers, no invented biological phenotype or selection effect */
const Life=(()=>{
function rand(s,id,k){let v=(s.seed^Math.imul(id+1,0x9e3779b1)^Math.imul(k+1,0x85ebca6b))>>>0;v=Math.imul(v^(v>>>16),0x7feb352d);return (v^(v>>>15))>>>0}
function founder(s,a){return Array.from({length:4},(_,k)=>[rand(s,a.id,k*2)%16,rand(s,a.id,k*2+1)%16])}
function inherit(s,a,m,d){return m.map((pair,k)=>[pair[rand(s,a.id,k*2+20)%2],d[k][rand(s,a.id,k*2+21)%2]])}
function stage(a,p){return a.age<Math.min(30,p.mature*.1)?'recém-nascido':a.age<p.mature*.35?'filhote':a.age<p.mature?'juvenil':a.age>p.age*.8?'idoso':'adulto'}
function init(s){for(const a of s.animals){a.genes??=(a.parentsGenes?inherit(s,a,...a.parentsGenes):founder(s,a));a.stage=stage(a,Vertebrates.P[a.sp])}}
function tick(s){init(s)}
return {founder,inherit,stage,init,tick};})();