import sys;sys.path.insert(0,'/home/claude/big')
from lib import *;from desk import build_desk;from projector import build_projector,build_stand;from room import *
bpy.ops.wm.read_factory_settings(use_empty=True)
S,H=build_room()
desk=build_desk((0,5.4,0),0);proj,reels=build_projector((-3.0,-1.2,.775),0);stand=build_stand((-3.0,-1.2,0))
# drop window glass and exterior (handled in the web scene)
for o in list(bpy.data.objects):
    if o.type=='MESH' and o.data.materials and o.data.materials[0].name in ('glass',):bpy.data.objects.remove(o,do_unlink=True)
# convert curves/text to meshes, apply modifiers
bpy.ops.object.select_all(action='DESELECT')
for o in bpy.data.objects:
    if o.type in('CURVE','FONT'):
        o.select_set(True)
bpy.context.view_layer.objects.active=next((o for o in bpy.data.objects if o.type in('CURVE','FONT')),None)
if bpy.context.view_layer.objects.active:bpy.ops.object.convert(target='MESH')
# name meshes by group root for interaction mapping
def root(o):
    while o.parent:o=o.parent
    return o.name
for o in bpy.data.objects:
    if o.type=='MESH':o['group']=root(o) if o.parent else ('Room_'+(o.name.replace('.','_') if o.name.startswith('Curtain') else o.name.split('.')[0]))
bpy.ops.export_scene.gltf(filepath='/home/claude/big/office20.glb',export_format='GLB',export_apply=True,export_extras=True,export_materials='PLACEHOLDER' if False else 'EXPORT',export_image_format='NONE',export_texcoords=True,export_normals=True,export_yup=True)
print('EXPORTED')
