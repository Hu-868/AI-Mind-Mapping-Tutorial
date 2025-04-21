// 代码雨效果
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const katakana = 'abcdefghijklmnopqrstuvwxyz';
const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nums = '012345678901010101';

const alphabet = katakana + latin + nums;

const fontSize = 16;
const columns = canvas.width / fontSize;

const drops = [];
for (let x = 0; x < columns; x++) {
    drops[x] = 1;
}

function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(draw, 33);

// 监听滚动事件，显示/隐藏返回顶部按钮
window.onscroll = function () {
    const backToTopButton = document.getElementById('back-to-top');
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
};

// 返回顶部函数
function scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

// 导航栏链接平滑滚动功能
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Markdown 实时转换功能
const textarea = document.getElementById('markdown-textarea');
const output = document.getElementById('markdown-output');

// 配置 marked 库以支持脚注和其他功能
const renderer = new marked.Renderer();
const originalText = renderer.text.bind(renderer);
renderer.text = function (text) {
    return text.replace(/\[\^(\d+)\]/g, function (match, number) {
        return `<sup><a href="#fn${number}" id="ref${number}">[${number}]</a></sup>`;
    });
};
const originalCode = renderer.code.bind(renderer);
renderer.code = function (code, lang, escaped) {
    const result = originalCode(code, lang, escaped);
    return result.replace(/\[\^(\d+)\]/g, function (match, number) {
        return `<sup><a href="#fn${number}" id="ref${number}">[${number}]</a></sup>`;
    });
};

marked.use({
    renderer,
    gfm: true,
    breaks: true,
    walkTokens: function (token) {
        if (token.type === 'paragraph') {
            token.text = token.text.replace(/\[\^(\d+)\]: (.*)/g, function (match, number, content) {
                return `<p id="fn${number}"><sup>[${number}]</sup> ${content} <a href="#ref${number}" class="footnote-backref">↩</a></p>`;
            });
        }
    }
});

textarea.addEventListener('input', function () {
    const markdownText = this.value;
    const html = marked.parse(markdownText);
    output.innerHTML = html;
});

// 渲染语法示例的演示框
function renderDemo(id, markdown) {
    const demoElement = document.getElementById(id);
    const html = marked.parse(markdown);
    demoElement.innerHTML = html;
}

renderDemo('demo-title', '# 一级主题\n## 二级主题\n### 三级主题');
renderDemo('demo-unordered-list', '- 分支1\n- 分支2\n- 分支3');
renderDemo('demo-ordered-list', '1. 分支1\n2. 分支2\n3. 分支3');
renderDemo('demo-nested-list', '- 主分支\n  - 子分支1\n  - 子分支2\n    - 子子分支1');
renderDemo('demo-emphasis', '**重要主题**\n*次要主题*');
renderDemo('demo-link', '[相关资料](https://www.bilibili.com/video/BV1ct4y1n7t9/?share_source=copy_web&vd_source=d23579b51f022983bf7256062915b949)');
renderDemo('demo-image', '![示例图片](https://picsum.photos/200/300)');
renderDemo('demo-table', '| 表头 1 | 表头 2 |\n| ---- | ---- |\n| 内容 1 | 内容 2 |');
renderDemo('demo-footnote', '这是一个脚注 [^1]。\n[^1]: 脚注的具体内容');
renderDemo('demo-task-list', '- [ ] 待办事项 1\n- [x] 已完成事项 2');
    
