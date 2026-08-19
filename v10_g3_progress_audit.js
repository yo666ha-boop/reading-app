const {spawnSync}=require('child_process');
const fs=require('fs');
const audits=[
 'v10_g3_nh_u0_u1_audit.js',
 'v10_g3_nh_u2_audit.js',
 'v10_g3_nh_u3_audit.js',
 'v10_g3_nh_u4_audit.js',
 'v10_g3_nh_u5_audit.js',
 'v10_g3_nh_u6_audit.js',
 'v10_g3_ss_p1_audit.js',
 'v10_g3_ss_p2_audit.js',
 'v10_g3_ss_p3_audit2.js',
 'v10_g3_ss_p4_audit.js'
];
let ok=true;let out=[];
for(const f of audits){
 if(!fs.existsSync(f)){ok=false;out.push(`MISSING ${f}`);continue}
 const r=spawnSync(process.execPath,[f],{encoding:'utf8'});
 out.push(`=== ${f} ===`);
 if(r.stdout)out.push(r.stdout.trim());
 if(r.stderr)out.push(r.stderr.trim());
 if(r.status!==0)ok=false;
}
out.push('G3 COVERAGE New Horizon core=25 passages (Unit0-6)');
out.push('G3 COVERAGE Sunshine reviewed=12 passages (PROGRAM1-4); PROGRAM5-7 pending');
out.push(`G3 PROGRESS ${ok?'PASS':'FAIL'}`);
console.log(out.join('\n'));
process.exit(ok?0:1);
