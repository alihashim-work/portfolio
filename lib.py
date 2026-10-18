import bpy, bmesh, math, os
from mathutils import Vector, Matrix
T2='/home/claude/ph/t2/'
def img(p,cs='sRGB'):
    i=bpy.data.images.load(p,check_existing=True);i.colorspace_settings.name=cs;return i
def scanned(name,base,scale,tint=(1,1,1),rough_mul=1.0,bump=1.0,sheen=0,coat=0,coat_r=.15,metal=0):
    m=bpy.data.materials.new(name);m.use_nodes=True;nt=m.node_tree;n=nt.nodes;l=nt.links
    for nd in list(n):
        if nd.type!='OUTPUT_MATERIAL':n.remove(nd)
    b=n.new('ShaderNodeBsdfPrincipled');l.new(b.outputs[0],n['Material Output'].inputs[0])
    tc=n.new('ShaderNodeTexCoord');sm=n.new('ShaderNodeVectorMath');sm.operation='SCALE';sm.inputs['Scale'].default_value=scale;l.new(tc.outputs['Object'],sm.inputs[0])
    def tx(path,cs):
        t=n.new('ShaderNodeTexImage');t.image=img(path,cs);t.projection='BOX';t.projection_blend=.3;l.new(sm.outputs[0],t.inputs[0]);return t
    d=tx(base+'_diff.jpg','sRGB');mx=n.new('ShaderNodeMix');mx.data_type='RGBA';mx.blend_type='MULTIPLY';mx.inputs['Factor'].default_value=1;l.new(d.outputs[0],mx.inputs[6]);mx.inputs[7].default_value=(*tint,1)
    if os.path.exists(base+'_ao.jpg'):
        ao=tx(base+'_ao.jpg','Non-Color');m2=n.new('ShaderNodeMix');m2.data_type='RGBA';m2.blend_type='MULTIPLY';m2.inputs['Factor'].default_value=.7;l.new(mx.outputs[2],m2.inputs[6]);l.new(ao.outputs[0],m2.inputs[7]);l.new(m2.outputs[2],b.inputs['Base Color'])
    else:l.new(mx.outputs[2],b.inputs['Base Color'])
    r=tx(base+'_rough.jpg','Non-Color');mm=n.new('ShaderNodeMath');mm.operation='MULTIPLY';mm.inputs[1].default_value=rough_mul;mm.use_clamp=True;l.new(r.outputs[0],mm.inputs[0]);l.new(mm.outputs[0],b.inputs['Roughness'])
    nm=tx(base+'_nor.jpg','Non-Color');nmap=n.new('ShaderNodeNormalMap');nmap.inputs['Strength'].default_value=bump;l.new(nm.outputs[0],nmap.inputs['Color']);l.new(nmap.outputs[0],b.inputs['Normal'])
    b.inputs['Sheen Weight'].default_value=sheen;b.inputs['Coat Weight'].default_value=coat;b.inputs['Coat Roughness'].default_value=coat_r;b.inputs['Metallic'].default_value=metal
    return m
def flat(name,col,rough=.5,metal=0,coat=0,trans=0,emit=None,es=0,aniso=0):
    m=bpy.data.materials.new(name);m.use_nodes=True;b=m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value=(*col,1);b.inputs['Roughness'].default_value=rough;b.inputs['Metallic'].default_value=metal;b.inputs['Coat Weight'].default_value=coat;b.inputs['Transmission Weight'].default_value=trans;b.inputs['Anisotropic'].default_value=aniso
    if emit: b.inputs['Emission Color'].default_value=(*emit,1);b.inputs['Emission Strength'].default_value=es
    return m
def hammertone(name,col):
    m=flat(name,col,.42,.75,.25);nt=m.node_tree;n=nt.nodes;b=n['Principled BSDF']
    v=n.new('ShaderNodeTexVoronoi');v.inputs['Scale'].default_value=180;bump=n.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.25;bump.inputs['Distance'].default_value=.0006
    nt.links.new(v.outputs['Distance'],bump.inputs['Height']);nt.links.new(bump.outputs[0],b.inputs['Normal']);return m
def link(o,coll=None):
    (coll or bpy.context.scene.collection).objects.link(o);return o
def mesh_obj(name,bm,mat=None,parent=None,smooth=False):
    me=bpy.data.meshes.new(name);bm.to_mesh(me);bm.free();o=bpy.data.objects.new(name,me);link(o)
    if mat:o.data.materials.append(mat)
    if smooth:
        for p in me.polygons:p.use_smooth=True
    if parent:o.parent=parent
    return o
def bevel(o,w=.004,seg=3,prof=.5,limit='ANGLE'):
    m=o.modifiers.new('bev','BEVEL');m.width=w;m.segments=seg;m.profile=prof;m.limit_method=limit;m.angle_limit=math.radians(40);m.harden_normals=True;return o
def box(name,size,loc,mat,parent=None,bev=.004,seg=3,prof=.5,rot=(0,0,0)):
    bm=bmesh.new();bmesh.ops.create_cube(bm,size=1);bmesh.ops.scale(bm,vec=size,verts=bm.verts)
    o=mesh_obj(name,bm,mat,parent);o.location=loc;o.rotation_euler=rot
    if bev:bevel(o,bev,seg,prof)
    return o
def cyl(name,r,depth,loc,mat,parent=None,seg=48,rot=(0,0,0),bev=0,r2=None):
    bm=bmesh.new();bmesh.ops.create_cone(bm,cap_ends=True,cap_tris=False,segments=seg,radius1=r,radius2=r if r2 is None else r2,depth=depth)
    o=mesh_obj(name,bm,mat,parent,smooth=True);o.location=loc;o.rotation_euler=rot
    if bev:bevel(o,bev,2)
    return o
def torus(name,R,r,loc,mat,parent=None,rot=(0,0,0),arc=None):
    bpy.ops.mesh.primitive_torus_add(major_radius=R,minor_radius=r,major_segments=48,minor_segments=12,location=loc,rotation=rot);o=bpy.context.object;o.name=name
    for c in o.users_collection:c.objects.unlink(o)
    link(o);o.data.materials.append(mat)
    for p in o.data.polygons:p.use_smooth=True
    if parent:o.parent=parent
    return o
def sweep(name,pts,profile_r,mat,parent=None,closed=False,res=24,flat=None):
    cu=bpy.data.curves.new(name,'CURVE');cu.dimensions='3D';cu.resolution_u=res;sp=cu.splines.new('BEZIER');sp.bezier_points.add(len(pts)-1)
    for bp,p in zip(sp.bezier_points,pts):bp.co=p;bp.handle_left_type=bp.handle_right_type='AUTO'
    sp.use_cyclic_u=closed;cu.bevel_depth=profile_r;cu.bevel_resolution=6;cu.use_fill_caps=True
    if flat:cu.extrude=flat
    o=bpy.data.objects.new(name,cu);link(o);o.data.materials.append(mat)
    if parent:o.parent=parent
    return o
def empty(name,loc=(0,0,0),parent=None):
    o=bpy.data.objects.new(name,None);link(o);o.location=loc
    if parent:o.parent=parent
    return o
