import sys;sys.path.insert(0,'/home/claude/big')
from lib import *;from desk import build_desk;from projector import build_projector,build_stand;from room import *
RES=os.environ.get('RES','640x360');SAMPLES=int(os.environ.get('SAMPLES','24'));SHOT=os.environ.get('SHOT','wide')
bpy.ops.wm.read_factory_settings(use_empty=True);sc=bpy.context.scene
S,H=build_room();exterior(S,'/home/claude/ext/exterior_plate.jpg')
desk=build_desk((0,5.4,0),0)
proj,reels=build_projector((-3.0,-1.2,.775),0);stand=build_stand((-3.0,-1.2,0))
# supporting scanned furniture (Poly Haven, CC0)
g('dining_chair_02',(0,6.15,0),0,1.0,'2k')
g('sofa_02',(3.2,-4.6,0),math.pi/2+.0,1.2)
g('mid_century_lounge_chair',(4.6,-2.4,0),math.pi/2+.5,1.0,'2k')
g('potted_plant_02',(4.6,9.1,0),0,1.7,'2k');g('potted_plant_02',(-4.7,9.1,0),1.2,1.6,'2k')
g('hanging_industrial_lamp',(0,5.4,H),0,1.0,'2k')
g('desk_lamp_arm_01',(-.75,5.65,.775),2.4,1.0,'2k')
# world sky through the north glazing + portal
wo=bpy.data.worlds.new('w');sc.world=wo;wo.use_nodes=True;wn=wo.node_tree.nodes;env=wn.new('ShaderNodeTexEnvironment');env.image=img('/home/claude/ph/h2/kloofendal_48d_partly_cloudy_puresky.hdr','Linear Rec.709');wo.node_tree.links.new(env.outputs[0],wn['Background'].inputs[0]);wn['Background'].inputs[1].default_value=2.2
pl=bpy.data.lights.new('portal','AREA');pl.shape='RECTANGLE';pl.size=8;pl.size_y=3.1;pl.cycles.is_portal=True;po=bpy.data.objects.new('portal',pl);link(po);po.location=(0,S-.05,2.05);po.rotation_euler=(-math.pi/2,0,0)
fl=bpy.data.lights.new('windowbounce','AREA');fl.shape='RECTANGLE';fl.size=8;fl.size_y=3;fl.energy=900;fl.color=(1,.88,.74);fo=bpy.data.objects.new('windowbounce',fl);link(fo);fo.location=(0,S-.4,2.1);fo.rotation_euler=(-math.pi/2,0,0)
def pt(n,loc,e,c,s=.05):
    L=bpy.data.lights.new(n,'POINT');L.energy=e;L.color=c;L.shadow_soft_size=s;o=bpy.data.objects.new(n,L);link(o);o.location=loc
pt('pendant',(0,5.4,3.05),110,(1,.78,.52),.1);pt('desklamp',(-.55,5.5,1.25),25,(1,.74,.45),.03)
sp=bpy.data.lights.new('projlamp','SPOT');sp.energy=float(os.environ.get('BEAM','0'));sp.spot_size=math.radians(28);sp.spot_blend=.15;sp.shadow_soft_size=.01;spo=bpy.data.objects.new('projlamp',sp);link(spo);spo.location=(-2.65,-1.2,.915);spo.rotation_euler=(0,math.pi/2,0)
# camera
cam=bpy.data.cameras.new('cam');cam.sensor_width=36;co=bpy.data.objects.new('cam',cam);link(co);sc.camera=co;cam.dof.use_dof=True
if SHOT=='wide':
    cam.lens=26;cam.dof.aperture_fstop=8;co.location=Vector((-7.2,-7.6,1.65));tgt=Vector((1.0,5.6,1.45));cam.shift_y=.04
elif SHOT=='desk':
    cam.lens=40;cam.dof.aperture_fstop=4;co.location=Vector((1.9,2.9,1.35));tgt=Vector((0,5.3,.85))
else:
    cam.lens=55;cam.dof.aperture_fstop=3.2;co.location=Vector((-2.1,-2.25,1.25));tgt=Vector((-3.0,-1.2,1.05))
d=tgt-co.location;co.rotation_euler=d.to_track_quat('-Z','Y').to_euler();cam.dof.focus_distance=d.length
if SHOT=='wide':co.rotation_euler[0]=math.pi/2  # keep verticals straight
sc.render.engine='CYCLES';sc.cycles.device='CPU';sc.cycles.samples=SAMPLES;sc.cycles.use_adaptive_sampling=True;sc.cycles.adaptive_threshold=.03
sc.cycles.use_denoising=True;sc.cycles.denoiser='OPENIMAGEDENOISE';sc.cycles.max_bounces=7;sc.cycles.diffuse_bounces=3;sc.cycles.glossy_bounces=3;sc.cycles.transmission_bounces=6;sc.cycles.sample_clamp_indirect=8;sc.cycles.caustics_reflective=False;sc.cycles.caustics_refractive=False
rx,ry=[int(v) for v in RES.split('x')];sc.render.resolution_x=rx;sc.render.resolution_y=ry
sc.view_settings.view_transform='AgX';sc.view_settings.look='AgX - Base Contrast';sc.view_settings.exposure=float(os.environ.get('EXPO','0.3'))
sc.render.image_settings.file_format='JPEG';sc.render.image_settings.quality=93;sc.render.filepath=os.environ.get('OUT','/home/claude/big/q.jpg')
if os.environ.get('SAVE'):bpy.ops.wm.save_as_mainfile(filepath='/home/claude/big/big_room.blend')
bpy.ops.render.render(write_still=True);print('RENDER DONE')
