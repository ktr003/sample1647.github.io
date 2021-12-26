// JavaScript source code
var drawing = false;
// �O��̍��W���L�^
var before_x = 0;
var before_y = 0;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

//�X�}�z�̐U�蕪��
var ua = navigator.userAgent;
if (ua.indexOf('iPhone') > 0) {
    ua = 'iphone';
} else if (ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
    ua = 'sp';
} else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
    ua = 'tab';
} else {
    ua = 'other';
}

//�C�x���g�̐U�蕪��
var EVENT = {};
if (ua != 'other') {//�X�}�[�g�t�H����������
    EVENT.TOUCH_START = 'touchstart';
    EVENT.TOUCH_MOVE = 'touchmove';
    EVENT.TOUCH_END = 'touchend';
} else {//�p�\�R����������
    EVENT.TOUCH_START = 'mousedown';
    EVENT.TOUCH_MOVE = 'mousemove';
    EVENT.TOUCH_END = 'mouseup';
}


canvas.addEventListener('mousemove', draw_canvas);

// �}�E�X���N���b�N���Ă鎞
canvas.addEventListener('mousedown', function (e) {
    drawing = true;
    var rect = e.target.getBoundingClientRect();
    before_x = e.clientX - rect.left;
    before_y = e.clientY - rect.top;
});

// �}�E�X���N���b�N���Ă��Ȃ���
canvas.addEventListener('mouseup', function () {
    drawing = false;
});

// �`��̏���
function draw_canvas(e) {
    if (!drawing) {
        return
    };
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var w = document.getElementById('width').value;
    var color = document.getElementById('color').value;
    var r = parseInt(color.substring(1, 3), 16);
    var g = parseInt(color.substring(3, 5), 16);
    var b = parseInt(color.substring(5, 7), 16);
    // �`��
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(before_x, before_y);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();
    // �`��Ō�̍��W��O��̍��W�ɑ������
    before_x = x;
    before_y = y;
}

var pen = document.getElementById('pencil');
var era = document.getElementById('eraser');

// ���M�Ə����S���̐؂�ւ�
function tool(btnNum) {
    // �N���b�N����{�^�������M��������
    if (btnNum == 1) {
        ctx.globalCompositeOperation = 'source-over';
        pen.className = 'active';
        era.className = '';
    }
    // �N���b�N����{�^���������S����������
    else if (btnNum == 2) {
        ctx.globalCompositeOperation = 'destination-out';
        pen.className = '';
        era.className = 'active';
    }
    // �N���b�N����{�^�����Ȃ��Ȃ킾������
    else if (btnNum == 3) {
        pen.className = '';
        era.className = '';
    }
}


window.addEventListener('load', function () {

    canvas.width = document.documentElement.clientWidth - 100;
    canvas.height = document.documentElement.clientHeight - 80;

    //�w�i�F
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    var img_datas_cnt = 0;
    var img_datas_arr = new Array();

    //�E�B���h�E���T�C�Y��
    window.addEventListener('resize', function (event) {

        // canvas�̈ʒu���W���擾�i�`�������̂�L�k�����Ȃ����߁A�L�����o�X�̑傫����ς���j
        clientRect = canvas.getBoundingClientRect();
        x = clientRect.left;
        y = clientRect.top;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        // ��x�����āA�ۑ����Ă����z��f�[�^��S�ĕ`���i�E�B���h�E��傫�������ꍇ�ɖ߂��j
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        for (var i = 0; i < img_datas_arr.length; i++) ctx.putImageData(img_datas_arr[i], 0, 0);

    });


    // �}�E�X�_�E���C�x���g��ݒ�
    window.addEventListener(EVENT.TOUCH_START, function (e) {
        //�X�}�z��������
        if (ua != 'other') e = e.touches[0];
        startX = e.pageX - x;
        startY = e.pageY - y;
        mousedown = true;

    });
    // �}�E�X�A�b�v�C�x���g��ݒ�
    window.addEventListener(EVENT.TOUCH_END, function (e) {
        mousedown = false;
        // �z��ɕۑ����Ă���
        img_datas_arr[img_datas_cnt] = ctx.getImageData(0, 0, canvas.width, canvas.height);
        img_datas_cnt++;

    });
    // �}�E�X���[�u�C�x���g��ݒ�
    window.addEventListener(EVENT.TOUCH_MOVE, function (e) {
        //�X�}�z��������
        if (ua != 'other') e = e.touches[0];
        if (mousedown) draw(e.pageX - x, e.pageY - y);
    });

    // �L�����o�X�ɕ`��
    function draw(x, y) {
        var target = document.getElementById('canvas');
        var context = target.getContext('2d');
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(x, y);
        context.closePath();
        context.stroke();
        startX = x;
        startY = y;
    }

    //�N���A�{�^���N���b�N��
    document.getElementById('delbt').addEventListener(EVENT.TOUCH_START, function (e) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return false;
    });

    // �ۑ��{�^���N���b�N��
    document.getElementById('savebt').addEventListener(EVENT.TOUCH_START, function (e) {
        //�w�i�F
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

        // �v�f�̃C�x���g�����Z�b�g���Ă���
        e.preventDefault();
        Fnk_SaveBt();
        return false;
    });

    // canvas��̃C���[�W��ۑ�
    function Fnk_SaveBt() {
        // base64�G���R�[�h
        var base64 = canvas.toDataURL('image/jpeg');
        var blob = Base64toBlob(base64);

        // blob�f�[�^��a�v�f���g���ă_�E�����[�h
        saveBlob(blob, 'memo.jpg');
    }

    // Base64�f�[�^��Blob�f�[�^�ɕϊ�
    function Base64toBlob(base64) {
        // �J���}�ŕ������Abase64�f�[�^�̕�������f�R�[�h
        var tmp = base64.split(',');
        var data = atob(tmp[1]);
        // tmp[0]�̕�����idata:image/png;base64�j����R���e���c�^�C�v�iimage/png�j�������擾
        var mime = tmp[0].split(':')[1].split(';')[0];
        //  1�������Ƃ�UTF-16�R�[�h��\�� 0����65535 �̐������擾
        var buf = new Uint8Array(data.length);
        for (var i = 0; i < data.length; i++) buf[i] = data.charCodeAt(i);
        // blob�f�[�^���쐬
        var blob = new Blob([buf], { type: mime });
        return blob;
    }

    // �摜�̃_�E�����[�h
    function saveBlob(blob, fileName) {
        var url = (window.URL || window.webkitURL);
        // �_�E�����[�h�p��URL�쐬
        var dataUrl = url.createObjectURL(blob);
        // �C�x���g�쐬
        var event = document.createEvent("MouseEvents");
        event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        // a�v�f���쐬
        var a = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
        a.href = dataUrl;
        a.download = fileName;
        a.dispatchEvent(event);
    }

});