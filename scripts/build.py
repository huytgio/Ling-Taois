"""Reproducible Godot smoke build; engine downloads use official SHA-512 sums."""
from pathlib import Path
import hashlib,os,subprocess,urllib.request,zipfile,shutil
ROOT=Path(__file__).resolve().parents[1]
TOOLS=Path(os.environ.get('GODOT_TOOLS',ROOT/'.tools')).resolve()
VERSION='4.5.1'; RELEASE=VERSION+'-stable'; BASE='https://github.com/godotengine/godot/releases/download/'+RELEASE+'/'
TOOLS.mkdir(parents=True,exist_ok=True)
def run(*args):
 print('+',*map(str,args),flush=True)
 subprocess.run(list(map(str,args)),cwd=ROOT,env=ENV,check=True)
def digest(p):
 h=hashlib.sha512()
 with p.open('rb') as f:
  while b:=f.read(4*1024*1024):h.update(b)
 return h.hexdigest()
checks=TOOLS/'SHA512-SUMS.txt'
if not checks.exists():checks.write_bytes(urllib.request.urlopen(BASE+'SHA512-SUMS.txt',timeout=90).read())
sums={l.split()[-1]:l.split()[0] for l in checks.read_text().splitlines() if len(l.split())==2}
def download(name):
 p=TOOLS/name
 if not p.exists() or digest(p)!=sums[name]:
  print('Downloading',name,flush=True)
  with urllib.request.urlopen(BASE+name,timeout=90) as r,p.open('wb') as f:
   while b:=r.read(4*1024*1024):f.write(b)
  if digest(p)!=sums[name]:raise RuntimeError('SHA-512 mismatch: '+name)
 return p
engine_name='Godot_v'+RELEASE+'_linux.x86_64';engine=TOOLS/engine_name
if not engine.exists():
 with zipfile.ZipFile(download(engine_name+'.zip')) as z:z.extractall(TOOLS)
engine.chmod(0o755)
template_dir=TOOLS/'export_templates'/ (VERSION+'.stable')
if not all((template_dir/n).exists() for n in ['web_nothreads_release.zip','android_debug.apk']):
 template_dir.mkdir(parents=True,exist_ok=True)
 with zipfile.ZipFile(download('Godot_v'+RELEASE+'_export_templates.tpz')) as z:
  for n in z.namelist():
   leaf=n.rsplit('/',1)[-1]
   if (leaf.startswith('web_') and leaf.endswith('.zip')) or leaf in ['android_release.apk','android_debug.apk','version.txt']:(template_dir/leaf).write_bytes(z.read(n))
ENV=os.environ.copy();ENV['GODOT_SILENCE_ROOT_WARNING']='1';ENV['XDG_DATA_HOME']=str(TOOLS/'data');ENV['XDG_CONFIG_HOME']=str(TOOLS/'config')
linked=TOOLS/'data/godot/export_templates'/ (VERSION+'.stable');linked.parent.mkdir(parents=True,exist_ok=True)
if not linked.exists():linked.symlink_to(template_dir,target_is_directory=True)
sdk=Path(os.environ.get('ANDROID_HOME',TOOLS/'android-sdk')).resolve();java=Path(os.environ.get('JAVA_HOME','/usr/lib/jvm/java-17-openjdk-amd64')).resolve();key=TOOLS/'test-debug.keystore'
if not key.exists():run(java/'bin/keytool','-genkeypair','-keystore',key,'-storepass','android','-keypass','android','-alias','androiddebugkey','-dname','CN=Godot Build Test','-keyalg','RSA','-keysize','2048','-validity','10000')
config=TOOLS/'config/godot/editor_settings-4.5.tres';config.parent.mkdir(parents=True,exist_ok=True)
config.write_text('[gd_resource type="EditorSettings" format=3]\n\n[resource]\nexport/android/android_sdk_path = "'+str(sdk)+'"\nexport/android/java_sdk_path = "'+str(java)+'"\nexport/android/debug_keystore = "'+str(key)+'"\nexport/android/debug_keystore_user = "androiddebugkey"\nexport/android/debug_keystore_pass = "android"\n')
(ROOT/'build').mkdir(exist_ok=True)
(ROOT/'build/.gdignore').touch()
for sub in ['web','android']:
 out=ROOT/'build'/sub
 if out.exists():shutil.rmtree(out)
 out.mkdir(parents=True)
run(engine,'--headless','--version')
run(engine,'--headless','--path',ROOT,'--editor','--import')
run(engine,'--headless','--path',ROOT,'--script','tests/smoke.gd')
run(engine,'--headless','--path',ROOT,'--export-release','Web',ROOT/'build/web/index.html')
run(engine,'--headless','--path',ROOT,'--export-debug','Android',ROOT/'build/android/LinhDao-Godot-Test.apk')
with zipfile.ZipFile(ROOT/'build/LinhDao-Godot-Web-Test.zip','w',zipfile.ZIP_DEFLATED) as z:
 for p in (ROOT/'build/web').iterdir():
  if p.is_file():z.write(p,p.name)
print('PASS: native Godot test, Web export, Android export.',flush=True)
