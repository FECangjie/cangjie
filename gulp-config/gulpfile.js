/**
 * Created by chao.qin.CJ on 16/8/8.
 */
//载入插件
var gulp = require('gulp');
var gulpPlugin = require('gulp-load-plugins')({
    rename: {'gulp-usemin-html': 'usemin'}
});
function timestamp() {//时间戳
    var date = new Date();
    var year = date.getFullYear();
    var month = _completion(date.getMonth() + 1);
    var d = _completion(date.getDate());
    var hours = _completion(date.getHours());
    var minutes = _completion(date.getMinutes());
    return year + "." + month + "." + d + " " + hours + ":" + minutes;
    function _completion(n) {//小于10自动补0
        if (typeof n != "number") {
            return NaN;
        }
        if (n >= 0 && n < 10) {
            return "0" + n
        } else {
            return n;
        }
    }
}
var path = './pp-ua-H5/';
/*====================================================创建任务=========================================================*/
gulp.task('default', function() {
    // 将你的默认的任务代码放在这
    gulp.start('help')
});

gulp.task('minify-js', function () {//JS压缩
    gulp.src('./*.js')
        .pipe(gulpPlugin.uglify())
        .pipe(gulpPlugin.header('/*最后修改日期 <%= date %>*/\n', {date: timestamp()}))
        .pipe(gulpPlugin.rename({suffix: '.min'}))
        .pipe(gulp.dest('./js'));
});

gulp.task('all-css', function () {//CSS合并
    gulp.src([path + 'static/css/*.css', '!' + path + 'all*.css', '!' + path + 'normalize.css'])
        .pipe(gulpPlugin.concat('all.css'))
        .pipe(gulpPlugin.autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulpPlugin.rename('all.css'))
        .pipe(gulp.dest(path+'dev/css'));
});

gulp.task('minify-css',function(){//css压缩
    gulp.src(path + 'dev/css/*.css')
        .pipe(gulpPlugin.minifyCss()) //该任务调用的模块
        .pipe(gulpPlugin.rename({suffix:'.min'}))
        .pipe(gulp.dest(path+'dev/css')); //将会在src/css下生成index.css
});

gulp.task('minify-html',function(){//html压缩
    gulp.src(path + 'password.html')
        .pipe(gulpPlugin.minifyHtml())
        .pipe(gulpPlugin.rename({suffix:'.min'}))
        .pipe(gulp.dest(path+'dev/html'))
});

gulp.task('jshint', function () {//js代码检查
    gulp.src(path+'static/js/*.js')
        .pipe(gulpPlugin.jshint())
        .pipe(gulpPlugin.jshint.reporter()); // 输出检查结果
});








//重载浏览器
gulp.task('reload', ['css', 'scripts'], function () {
    Browsersync.init({
        proxy: "http://localhost:63342/企业网银操作指南/app/dev/"
    });
    gulp.watch(['./app/dev/css/*.css', './app/dev/js/*.js', './app/dev/**/*.html']).on('change', reload);
});

//定义一个testLess任务（自定义任务名称）
gulp.task('testLess', function () {
    gulp.src('src/less/index.less') //该任务针对的文件
        .pipe(less()) //该任务调用的模块
        .pipe(gulp.dest('src/css')); //将会在src/css下生成index.css
});

//JS校验
gulp.task('hint', function () {
    var path = "./app/dev/js/";
    return gulp.src(path + '*.js', '!' + path + 'html5shiv.min.js', '!' + path + 'jquery-1.7.1.min.js', '!' + path + 'modernizr-2.8.3.min.js', '!' + path + 'nwmatcher.min.js', '!' + path + 'selectivizr.min.js', '!' + path + 'all.js')
        .pipe(gulpPlugin.jshint());
});

gulp.task('help',function () {
    console.log('	gulp build			文件打包');
    console.log('	gulp watch			文件监控打包');
    console.log('	gulp help			gulp参数说明');
    console.log('	gulp server			测试server');
    console.log('	gulp -p				生产环境（默认生产环境）');
    console.log('	gulp -d				开发环境');
});