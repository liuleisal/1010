(function(){
  var main = {
    carsel:0,
    swiper: function(){
      new Swiper ('.swiper-vertical', {
        direction : 'vertical',
        on:{
          init: function(){
            swiperAnimateCache(this); //隐藏动画元素 
            swiperAnimate(this); //初始化完成开始动画
          }, 
          slideChangeTransitionEnd: function(){ 
            swiperAnimate(this); //每个slide切换结束时也运行当前slide动画
            //this.slides.eq(this.activeIndex).find('.ani').removeClass('ani'); 动画只展现一次，去除ani类名
          } 
        }
      }) 
      new Swiper('.swiper-video', {
        pagination: {
          el: '.swiper-video .swiper-car-pagination',
          clickable :true,
        },
      });
      new Swiper('.swiper-bar', {
        direction: 'vertical',
        roundLengths : true, 
        slidesPerView: 'auto',
        freeMode: true,
        scrollbar: {
          el: '.swiper-scrollbar',
          dragSize:32,
          draggable: true,
        },
        mousewheel: true,
      });
    },
    clickEvt: function(){
      const _this = this
      $('#carsel').change(() => {
        const carsel = $("#carsel option:selected").val();
        if(carsel!==_this.carsel){
          $('#tab').attr('src',`./images/t${carsel}.jpg`)
          _this.carsel = carsel
        }
      })
      $('#sub').click(() => {
        const name = $('#name').val(),
              phone = $('#phone').val(),
              adr = $("#adr option:selected").val(),
              city = $("#city option:selected").val(),
              car = $("#car option:selected").val();
        if(!name){
          alert('请输入姓名')
          return
        }
        if(!phone){
          alert('请输入联系方式')
          return
        }
        if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone))) {
          alert('手机格式不正确')
          return false;
        }
        if(!car){
          alert('请选择车型')
          return
        }
        if(!adr){
          alert('请选择经销商')
          return
        }
        const data = {
          name,
          phone,
          city,
          dealer:adr,
          carType:car
        }
        $.ajax({
          url:'http://47.106.95.183:8082/api/enroll/audiEnroll',
          type: "POST",
          dataType: "json",
          contentType: 'application/json; charset=utf-8', 
          data: JSON.stringify(data),
          success: function(result){
            const {code,messgae} = result
            if(code===200){
              alert('信息提交成功')
            }else{
              alert(messgae||'提交失败')
            }
          },
          error: function(err){
            console.log('发生错误',err)
          }
        })

        
      })
    },
    wxShare: function(){
      $.ajax({
        url:'//t-csbj.linkroutes.com/api/wx/signature',
        type: "POST",
        dataType: "json",
        headers:{
          'Content-Type':'application/x-www-form-urlencoded'
        },
        data:{
          url: encodeURIComponent(location.href.split('#')[0])
        },
        success: function(result){
          const {data} = result
          wx.config({
            debug: false,
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr, 
            signature: data.signature,
            jsApiList: [ 'onMenuShareTimeline','onMenuShareAppMessage'] 
          });
        },
        error: function(err){
          console.log('发生错误',err)
        }
      })
    },
    audioFn: function(){
      var audioPlayer = document.getElementById('music');
      document.addEventListener('DOMContentLoaded',function (){
      　　function audioAutoPlay(){
          　　document.addEventListener("WeixinJSBridgeReady", function () {
            　　audioPlayer.play()
                $('#musicCtr').addClass('music-current') 
          　　}, false)
      　　}
      　　audioAutoPlay()
      });
      $('#musicCtr').click(() => {
        if (audioPlayer.paused) {   
          audioPlayer.play()
          $('#musicCtr').addClass('music-current')
        }else{      
          audioPlayer.pause()
          $('#musicCtr').removeClass('music-current')   
        }
      })
      const video1 = document.getElementById("video1"),
            video2 = document.getElementById("video2"),
            video3 = document.getElementById("video3")
      video1.addEventListener('play',function(){
        audioPlayer.pause()
        $('#musicCtr').removeClass('music-current')
      })
      video2.addEventListener('play',function(){
        audioPlayer.pause()
        $('#musicCtr').removeClass('music-current')
      })
      video3.addEventListener('play',function(){
        audioPlayer.pause()
        $('#musicCtr').removeClass('music-current')
      })
    },
    init: function(){
      if(location.href.indexOf('https')>-1){
        location.href = location.href.replace('https','http')
        return
      }
      this.wxShare()
      this.swiper()
      this.clickEvt()
      this.audioFn()

    }
  }
  main.init()
})()