from lib import *
import json
PH='/home/claude/ph/'
def g(name,loc,rz=0,s=1.0,res='1k'):
    p=f'{PH}m2/{name}/{name}.gltf' if res=='2k' else f'{PH}{name}/{name}.gltf'
    before=set(bpy.data.objects);bpy.ops.import_scene.gltf(filepath=p);new=[o for o in bpy.data.objects if o not in before]
    r=empty(name+'_root',loc)
    for o in new:
        if o.parent is None:o.parent=r
    r.rotation_euler=(0,0,rz);r.scale=(s,s,s);return r
def build_room():
    S=10.0;H=4.5
    Pq=scanned('parquet',T2+'herringbone_parquet',.55,tint=(.62,.48,.36),rough_mul=1.0,coat=.12,coat_r=.3)
    Pl=scanned('plaster',T2+'painted_plaster_wall',.45,tint=(.56,.50,.43),bump=.35)
    Wn=scanned('walnut_wall',T2+'smoked_walnut_veneer',1.2,tint=(.30,.19,.12),rough_mul=.65,coat=.5)
    Vel=scanned('velvet',T2+'velour_velvet',2.4,tint=(.36,.05,.08),sheen=1.0,bump=.5)
    Cei=scanned('ceiling',T2+'painted_plaster_wall',.35,tint=(.62,.58,.52),bump=.2)
    Steel=flat('steel',(.02,.02,.022),.32,.85,.2)
    box('Floor',(2*S,2*S,.1),(0,0,-.05),Pq,bev=0)
    box('Ceiling',(2*S,2*S,.1),(0,0,H+.05),Cei,bev=0)
    # coffer beams
    for x in (-5,0,5):box('Beam',(.35,2*S,.3),(x,0,H-.15),Wn,bev=.01)
    for y in (-5,0,5):box('Beam',(2*S,.35,.3),(0,y,H-.15),Wn,bev=.01)
    def wall(x0,x1,y,z0,z1,mat,axis='x',t=.25):
        if axis=='x':box('Wall',(x1-x0,t,z1-z0),((x0+x1)/2,y,(z0+z1)/2),mat,bev=0)
        else:box('Wall',(t,x1-x0,z1-z0),(y,(x0+x1)/2,(z0+z1)/2),mat,bev=0)
    # north wall (+Y) with an 8 m glazed bay
    for (a,b) in [(-S,-4),(4,S)]:
        wall(a,b,S+.125,0,1.2,Wn);wall(a,b,S+.125,1.2,H,Pl)
    wall(-4,4,S+.125,0,.5,Wn);wall(-4,4,S+.125,3.6,H,Pl)
    for (a,b,yy,ax) in [(-S,S,-S-.125,'x')]:
        wall(a,b,yy,0,1.2,Wn,ax);wall(a,b,yy,1.2,H,Pl,ax)
    for xx in (S+.125,-S-.125):
        wall(-S,S,xx,0,1.2,Wn,'y');wall(-S,S,xx,1.2,H,Pl,'y')
    # chair rail, skirting, crown
    Tr=flat('trim',(.03,.02,.015),.35,0,.6)
    for (sz,loc) in [((2*S,.05,.06),(0,S-.02,1.22)),((2*S,.05,.06),(0,-S+.02,1.22)),((.05,2*S,.06),(S-.02,0,1.22)),((.05,2*S,.06),(-S+.02,0,1.22))]:box('Rail',sz,loc,Tr,bev=.01)
    # window: steel mullions + transom, glass, sill
    for x in [-4+k for k in range(9)]:box('Mullion',(.06,.12,3.1),(x,S,2.05),Steel,bev=.006)
    for z in (.5,3.0,3.6):box('Transom',(8.06,.12,.06),(0,S,z),Steel,bev=.006)
    box('Sill',(8.2,.4,.06),(0,S-.18,.5),flat('sillstone',(.12,.11,.10),.25,0,.6),bev=.01)
    bpy.ops.mesh.primitive_plane_add(size=1,location=(0,S+.02,2.05));gl=bpy.context.object;gl.scale=(8,3.1,1);gl.rotation_euler=(math.pi/2,0,0)
    gm=flat('glass',(1,1,1),0,0,0,1);gm.node_tree.nodes['Principled BSDF'].inputs['IOR'].default_value=1.45;gl.data.materials.append(gm);gl.visible_shadow=False;gl.visible_diffuse=False
    # pleated blackout velvet curtains, gathered open at both ends and at the centre mullion
    def curtain(x0,width,folds,open_frac=1.0):
        bm=bmesh.new();nx=folds*12;nz=60;hgt=3.75
        verts=[[None]*(nz+1) for _ in range(nx+1)]
        for i in range(nx+1):
            u=i/nx
            for k in range(nz+1):
                v=k/nz;z=.08+v*hgt
                amp=.07*(1+.25*(1-v))
                x=x0+u*width*(1+.08*(1-v)*(u-.5))
                y=S-.32+math.sin(u*folds*2*math.pi)*amp+(1-v)*.03*math.sin(u*7)
                verts[i][k]=bm.verts.new((x,y,z))
        for i in range(nx):
            for k in range(nz):bm.faces.new((verts[i][k],verts[i+1][k],verts[i+1][k+1],verts[i][k+1]))
        o=mesh_obj('Curtain',bm,Vel,smooth=True);m=o.modifiers.new('sol','SOLIDIFY');m.thickness=.012;return o
    for (x0,w) in [(-4.6,1.1),(3.5,1.1),(-.55,1.1)]:curtain(x0,w,7)
    box('CurtainRail',(9.4,.06,.06),(0,S-.32,3.86),flat('railbrass',(.6,.43,.2),.3,1),bev=.01)
    # projection screen on the east wall (-X face)
    box('ScreenBorder',(.04,6.4,3.7),(S-.03,0,2.35),flat('screenborder',(.01,.01,.01),.9),bev=.005)
    box('ProjectionSurface',(.02,6.0,3.375),(S-.06,0,2.35),flat('screen',(.82,.81,.78),.95),bev=0)
    Rug=scanned('rugwool',T2+'velour_velvet',3.0,tint=(.10,.07,.06),sheen=.6,bump=.8)
    RugB=scanned('rugborder',T2+'velour_velvet',3.0,tint=(.22,.06,.05),sheen=.6,bump=.8)
    for (cx,cy,w,d) in [(0,5.0,4.4,3.2),(3.6,-3.6,4.6,3.4)]:
        box('RugBorder',(w,d,.012),(cx,cy,.006),RugB,bev=.004);box('Rug',(w-.36,d-.36,.014),(cx,cy,.008),Rug,bev=.003)
    return S,H
def exterior(S,photo):
    bpy.ops.mesh.primitive_plane_add(size=1,location=(0,S+75,1.0));bd=bpy.context.object;bd.scale=(112,75,1);bd.rotation_euler=(math.pi/2,0,0)
    bm=bpy.data.materials.new('exterior');bm.use_nodes=True;nt=bm.node_tree;n=nt.nodes;l=nt.links;n.remove(n['Principled BSDF']);em=n.new('ShaderNodeEmission');ti=n.new('ShaderNodeTexImage');ti.image=img(photo);l.new(ti.outputs[0],em.inputs[0]);em.inputs[1].default_value=1.25;l.new(em.outputs[0],n['Material Output'].inputs[0]);bd.data.materials.append(bm);bd.visible_shadow=False;bd.visible_diffuse=False
