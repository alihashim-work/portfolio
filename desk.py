from lib import *
def build_desk(root_loc=(0,0,0),rot=0):
    W=scanned('walnut_desk',T2+'smoked_walnut_veneer',1.7,tint=(.40,.25,.15),rough_mul=.55,coat=.85,coat_r=.08,bump=.6)
    Wd=scanned('walnut_dark',T2+'smoked_walnut_veneer',1.7,tint=(.26,.15,.09),rough_mul=.6,coat=.7,coat_r=.1,bump=.6)
    Lth=scanned('desk_leather',T2+'fabric_leather_02',3.0,tint=(.12,.20,.13),rough_mul=.8,coat=.2)
    Br=flat('desk_brass',(.75,.55,.24),.24,1,0,aniso=.3);Gold=flat('tooling',(.8,.6,.25),.35,1)
    R=empty('Desk_Root',root_loc);R.rotation_euler=(0,0,rot)
    TOPZ=.755
    for sx in (-1,1):
        cx=sx*.735
        # plinth with stepped moulding
        box('Plinth',(.56,.90,.07),(cx,0,.035),Wd,R,bev=.008,seg=4,prof=.7)
        box('PlinthCap',(.54,.88,.02),(cx,0,.08),W,R,bev=.006,seg=3,prof=.3)
        # carcass
        box('Pedestal',(.50,.84,.62),(cx,0,.40),W,R,bev=.003,seg=2)
        # visitor face (-Y) and outer side: fielded raised panels
        for (pz,ph) in [(.30,.30),(.58,.16)]:
            box('FrontPanel',(.40,.012,ph),(cx,-.425,pz),W,R,bev=.01,seg=4,prof=.35)
            box('FrontPanelField',(.30,.006,ph-.08),(cx,-.433,pz),Wd,R,bev=.004,seg=2)
        ox=cx+sx*.255
        for (py,pw) in [(-.2,.34),(.2,.34)]:
            box('SidePanel',(.012,pw,.42),(ox,py,.40),W,R,bev=.01,seg=4,prof=.35)
            box('SidePanelField',(.006,pw-.08,.32),(ox+sx*.007,py,.40),Wd,R,bev=.004,seg=2)
        # drawers on the sitter side (+Y)
        z=.11
        for k,h in enumerate([.21,.19,.17]):
            zc=z+h/2
            box('DrawerFront',(.46,.022,h-.008),(cx,.43,zc),W,R,bev=.006,seg=4,prof=.4)
            box('DrawerField',(.38,.006,h-.06),(cx,.443,zc),Wd,R,bev=.003,seg=2)
            # brass bail pull: backplate, posts, bail
            box('PullPlate',(.12,.004,.035),(cx,.447,zc+.01),Br,R,bev=.0015,seg=2,prof=.8)
            for px in (-.045,.045):cyl('PullPost',.005,.012,(cx+px,.452,zc+.01),Br,R,seg=16,rot=(math.pi/2,0,0))
            b=torus('Bail',.045,.0035,(cx,.457,zc+.002),Br,R,rot=(0,0,0))
            b.scale=(1,1,.55);b.rotation_euler=(0,0,0)
            bm=bpy.data.meshes[b.data.name]
            bmw=bmesh.new();bmw.from_mesh(bm);[bmw.verts.remove(v) for v in [v for v in bmw.verts if v.co.y>0]];bmw.to_mesh(bm);bmw.free()
            b.rotation_euler=(math.pi/2,0,0)
            cyl('Keyhole',.008,.003,(cx,.447,zc+h/2-.03),Br,R,seg=20,rot=(math.pi/2,0,0))
            z+=h+.006
    # modesty panel (visitor side) between pedestals
    box('ModestyPanel',(.98,.03,.50),(0,-.40,.45),W,R,bev=.003)
    for px in (-.25,.25):
        box('ModestyRaised',(.40,.012,.36),(px,-.418,.45),W,R,bev=.012,seg=4,prof=.35)
        box('ModestyField',(.30,.006,.26),(px,-.426,.45),Wd,R,bev=.004)
    box('Apron',(1.0,.035,.07),(0,-.41,.66),W,R,bev=.006,seg=3,prof=.6)
    # centre drawer (sitter side)
    box('CentreDrawer',(.94,.022,.085),(0,.43,.655),W,R,bev=.005,seg=3)
    box('CentrePlate',(.14,.004,.03),(0,.444,.655),Br,R,bev=.0015,seg=2,prof=.8)
    # top: bullnose slab over a cove moulding, leather writing surface with gold tooling
    box('TopCove',(2.02,.96,.022),(0,0,TOPZ-.026),W,R,bev=.009,seg=5,prof=.25)
    box('Top',(2.06,1.0,.036),(0,0,TOPZ),W,R,bev=.014,seg=6,prof=.7)
    box('Leather',(1.70,.62,.002),(0,.03,TOPZ+.0185),Lth,R,bev=.0006,seg=1)
    for (sx2,sy2,lx,ly) in [(0,.03+.31-.018,1.64,.003),(0,.03-.31+.018,1.64,.003),(.85-.018,.03,.003,.56),(-.85+.018,.03,.003,.56)]:
        box('Tooling',(lx,ly,.0006),(sx2,sy2,TOPZ+.0198),Gold,R,bev=0)
    # desk accessories: brass inkwell stand, pen, leather blotter corners
    cyl('Inkwell',.035,.05,(.62,.18,TOPZ+.04),flat('glass_ink',(.02,.03,.05),.05,0,0,.9),R,seg=32)
    cyl('InkCap',.03,.02,(.62,.18,TOPZ+.074),Br,R,seg=32,bev=.003)
    box('PenTray',(.24,.06,.012),(.55,.04,TOPZ+.024),Br,R,bev=.004,seg=3,prof=.2)
    cyl('Pen',.006,.15,(.55,.04,TOPZ+.036),flat('pen',(.02,.02,.02),.2,0,1),R,seg=16,rot=(0,math.pi/2,.1))
    return R
