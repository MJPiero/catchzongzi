
# 导入compass组件
require 'compass-normalize'
require 'compass/import-once/activate'

# 路劲
http_path = "./"
css_dir = "css"
sass_dir = "sass"
images_dir = "images"
javascripts_dir = "js"

# 转换utf-8
Encoding.default_external = "utf-8"

# 压缩 :expanded or :nested or :compact or :compressed
output_style = :compressed

# To enable relative paths to assets via compass helper functions. Uncomment:
relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
# line_comments = false


# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass

# 生成map文件
sourcemap = true



