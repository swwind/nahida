struct MenuBackgroundMaterial {
    time: f32,
};

@group(1) @binding(0)
var<uniform> material: MenuBackgroundMaterial;
@group(1) @binding(1)
var base_color_texture: texture_2d<f32>;
@group(1) @binding(2)
var base_color_sampler: sampler;

@fragment
fn fragment(
    #import bevy_pbr::mesh_vertex_output
) -> @location(0) vec4<f32> {
    // return textureSample(base_color_texture, base_color_sampler, uv);
    return vec4<f32>(
        cos(material.time) * 0.5 + 0.5,
        sin(material.time) * 0.5 + 0.5,
        1.0,
        1.0
    );
}
