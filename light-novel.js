// 主函数，供 Tampermonkey 调用
let main = function() {

    // 启动按钮
    $(document).ready(function() {
        // 在页面中插入一个执行按钮
        setBtn();

        // 点击按钮执行操作
        $('#lkclean').click(function(e) {
            mainTask();
        });

    });

    // 主要操作逻辑
    let mainTask = () => {
        // 1. 把当前页面的图片提出到正文
        getImgLinks();
        // 2. 清理无用字符
        rmFont();
        // 3. 提取正文文字到变量
        const text = getText();
        // 4. 正文文字插入到一个 div 中，等待复制
        setTextBox(text);
        // 5. 原页面帖子隐藏
        $('#postlist').hide();
    }

    // 设置按钮
    let setBtn = () => {
        $('#pgt').append('<button id="lkclean" type="button">清理</button>');

        const btnCss = {
            color: "#fff",
            fontSize: "1.15em",
            height: "33px",
            width: "60px",
            cursor: "pointer",
            background: "linear-gradient(to bottom, #63b1e9, #2179cd)",
            borderRadius: "3px",
            border: "1px solid #2865ab",
            boxShadow: "inset 0 0 1px 1px rgba(255,255,255,0.5)"
        };
        $('#lkclean').css(btnCss);
        $('#lkclean').hover(function() {
            // over
            const hoverShadow = "rgba(0, 0, 0, 0.1) 0px 0px 10px 5px inset, inset 0 0 1px 0px rgba(0,0,0, 0.5)";
            $(this).css('box-shadow', hoverShadow);
        }, function() {
            // out
            const normalShadow = "inset 0 0 1px 1px rgba(255,255,255,0.5)";
            $(this).css('box-shadow', normalShadow);
        });

    }

    // 把当前页面的图片提出到正文
    let getImgLinks = () => {

        let imgs = $('img[id^="aimg_"]');

        for (let i = 0; i < imgs.length; i++) {

            const imgBlock = imgs[i].closest('ignore_js_op');

            let newImg = document.createElement('img');
            $(newImg).css('width', '50%');

            if (imgBlock) {
                newImg.src = 'https://www.lightnovel.cn/' + imgs[i].getAttribute('file');
                imgBlock.after(newImg);
                imgBlock.remove();
            } else {
                if (imgs[i].getAttribute('file')) {
                    newImg.src = imgs[i].getAttribute('file');
                } else {
                    newImg.src = imgs[i].src;
                }
                imgs[i].after(newImg);
                imgs[i].remove();
            }

            $(newImg).after('<br>' + newImg.src);

        }
    };

    // 清理无用字符
    let rmFont = () => {
        let fonts = document.getElementsByTagName("font");
        $('i.pstatus').remove();
        for (let i = 0; i < fonts.length; i++) {
            let fontzero = fonts[i];
            if (fontzero.style.fontSize == "0px") {
                fontzero.style.display = "none";
            }
        }
    }

    // 设置文本框
    let setTextBox = (text) => {
        let box = document.createElement('div');
        const boxCss = {
            width: '100%',
            border: '1px solid #cdcdcd',
            padding: '20px',
            boxSizing: 'border-box'
        }
        box.setAttribute("contentEditable", true);
        $(box).css(boxCss);
        box.innerHTML = text;
        $('#postlist').before(box);
    }

    // 获取当页文本
    let getText = () => {
        let textElem = document.querySelectorAll('td[id^="postmessage_"]');
        let text = [];

        for (let i = 0; i < textElem.length; i++) {
            text.push(textElem[i].innerHTML);
        }

        return text.join('\n<br>\n');
    }

}