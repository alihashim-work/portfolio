from lib import *
def spoked(name,r,th,mat,parent,loc,rot):
    bm=bmesh.new()
    # outer disc with three kidney cut-outs (built as polygon fill)
    o=cyl(name,r,th,loc,mat,parent,seg=96,rot=rot)
    for k in range(3):
        a=k*2*math.pi/3+.3
        hole=cyl(name+'_hole',r*.33,th*4,(0,0,0),mat,None,seg=40)
        hole.location=(math.cos(a)*r*.56,math.sin(a)*r*.56,0);hole.scale=(1.25,.8,1);hole.rotation_euler=(0,0,a)
        m=o.modifiers.new('cut','BOOLEAN');m.operation='DIFFERENCE';m.object=hole;m.solver='EXACT'
        hole.hide_render=True;hole.hide_viewport=True;hole.parent=o
    return o
def build_projector(root_loc=(0,0,0),rot=0):
    HT=hammertone('proj_body',(.07,.08,.075));Ch=flat('chrome',(.85,.85,.85),.08,1);Al=flat('alu',(.7,.7,.72),.3,1,aniso=.5)
    Blk=flat('blackpaint',(.015,.015,.016),.35,.2,.4);Film=flat('film',(.09,.05,.025),.25,0,.6);Glass=flat('lensglass',(.9,.95,1),0,0,0,1)
    Rub=flat('rubber',(.01,.01,.01),.85)
    R=empty('Projector_Root',root_loc);R.rotation_euler=(0,0,rot)
    # cast base and mechanism housing
    box('Base',(.46,.26,.035),(0,0,.0175),HT,R,bev=.012,seg=4,prof=.6)
    for fx in (-.2,.2):
        for fy in (-.1,.1):cyl('Foot',.018,.012,(fx,fy,-.004),Rub,R,seg=24)
    box('Housing',(.30,.17,.19),(.01,0,.13),HT,R,bev=.03,seg=6,prof=.55)
    box('HousingTop',(.22,.14,.04),(.02,0,.235),HT,R,bev=.018,seg=5,prof=.6)
    # lamp house with louvres (rear)
    cyl('LampHouse',.07,.24,(-.17,0,.16),HT,R,seg=48,bev=.006)
    cyl('LampCap',.078,.03,(-.17,0,.29),HT,R,seg=48,bev=.008)
    for k in range(10):
        z=.07+k*.017
        box('Louvre',(.02,.11,.004),(-.235,0,z),Blk,R,bev=.0015,seg=2,rot=(0,-.4,0))
    # lens assembly (front, +X)
    cyl('LensMount',.045,.03,(.17,0,.14),HT,R,seg=48,rot=(0,math.pi/2,0),bev=.004)
    cyl('LensBarrel',.032,.13,(.24,0,.14),Ch,R,seg=64,rot=(0,math.pi/2,0))
    kn=cyl('FocusRing',.037,.035,(.22,0,.14),Al,R,seg=120,rot=(0,math.pi/2,0))
    for i,v in enumerate(kn.data.vertices):
        rr=math.hypot(v.co.x,v.co.y)
        if rr>.03 and i%2==0: v.co.x*=0.96;v.co.y*=0.96
    cyl('LensHood',.036,.02,(.31,0,.14),Blk,R,seg=64,rot=(0,math.pi/2,0),bev=.002)
    cyl('LensGlass',.027,.004,(.321,0,.14),Glass,R,seg=48,rot=(0,math.pi/2,0))
    # reel arms (cast), spindles and reels
    arms=[((.0,.0,.25),(.10,0,.36),(.17,0,.47)),((-.02,0,.25),(-.12,0,.36),(-.20,0,.45))]
    for a in arms:sweep('ReelArm',[Vector(p) for p in a],.014,HT,R,res=16)
    reels=[]
    for (rx,rz,nm) in [(.17,.47,'ReelFront'),(-.20,.45,'ReelRear')]:
        piv=empty(nm,(rx,0,rz),R)
        for fy in (-.014,.014):spoked(nm+'_Flange',.19,.0025,Al,piv,(0,fy,0),(math.pi/2,0,0))
        cyl(nm+'_Film',.135 if nm=='ReelFront' else .1,.024,(0,0,0),Film,piv,seg=96,rot=(math.pi/2,0,0))
        cyl(nm+'_Hub',.03,.034,(0,0,0),Ch,piv,seg=48,rot=(math.pi/2,0,0),bev=.003)
        cyl(nm+'_Spindle',.008,.06,(0,-.03,0),Ch,piv,seg=24,rot=(math.pi/2,0,0))
        reels.append(piv)
    # sprockets, gate and film path
    for (sx,sz) in [(.05,.22),(.08,.10),(-.03,.06)]:
        s=cyl('Sprocket',.018,.02,(sx,-.09,sz),Ch,R,seg=36,rot=(math.pi/2,0,0))
    box('Gate',(.05,.012,.09),(.12,-.088,.15),Ch,R,bev=.003)
    path=[(.17-.135,-.095,.47),(.07,-.095,.30),(.05,-.095,.22),(.12,-.095,.19),(.12,-.095,.11),(.08,-.095,.10),(-.03,-.095,.06),(-.10,-.095,.20),(-.20+.1,-.095,.45-.02)]
    sweep('FilmPath',[Vector(p) for p in path],0.0,Film,R,res=32,flat=.008)
    # control panel and knurled knobs
    box('Panel',(.16,.004,.06),(0,-.087,.06),Blk,R,bev=.002)
    for k,x in enumerate((-.05,0,.05)):
        kn=cyl('Knob',.012,.018,(x,-.098,.06),Al,R,seg=40,rot=(math.pi/2,0,0),bev=.002)
    cyl('Toggle',.003,.022,(.065,-.1,.075),Ch,R,seg=12,rot=(math.pi/2+.4,0,0))
    # name plate (generic, no brand)
    bpy.ops.object.text_add(location=(0,-.0865,.205));t=bpy.context.object;t.data.body='CINÉ 16';t.data.size=.022;t.data.extrude=.0006;t.data.align_x='CENTER';t.rotation_euler=(math.pi/2,0,0);t.parent=R;t.data.materials.append(Ch)
    for c in t.users_collection:c.objects.unlink(t)
    link(t)
    # power cord
    sweep('Cord',[Vector(p) for p in [(-.24,.05,.05),(-.32,.08,.0),(-.4,.2,-.4),(-.5,.25,-.72)]],.004,Rub,R,res=16)
    return R,reels
def build_stand(loc,rot=0):
    W=bpy.data.materials.get('walnut_desk') or scanned('walnut_desk',T2+'smoked_walnut_veneer',1.7,tint=(.40,.25,.15),rough_mul=.55,coat=.85)
    R=empty('ProjectorStand',loc);R.rotation_euler=(0,0,rot)
    box('StandTop',(.66,.48,.035),(0,0,.74),W,R,bev=.01,seg=5,prof=.7)
    box('StandApron',(.6,.42,.08),(0,0,.68),W,R,bev=.004)
    for fx in (-.28,.28):
        for fy in (-.19,.19):
            cyl('StandLeg',.024,.66,(fx,fy,.33),W,R,seg=24,r2=.016,bev=.002)
    box('StandShelf',(.58,.40,.02),(0,0,.18),W,R,bev=.006)
    Can=flat('canister',(.6,.6,.62),.35,1)
    for k in range(3):cyl('FilmCan',.18,.03,(.0,0,.205+k*.032),Can,R,seg=64,bev=.002)
    return R
