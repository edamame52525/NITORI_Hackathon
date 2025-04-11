// 雪のエフェクトの状態を追跡する変数
let isSnowing = false;

// 非同期通信を実行する関数
async function sendMessage() {
    // 最初の送信時に例のテキストを非表示にする
    hideExampleTexts();

    // ユーザの入力内容を取得
    const userInput = document.getElementById('text-input').value;

    if (userInput.trim() === '') return; // 空メッセージ送信防止

    // ユーザーメッセージを表示
    appendMessage(userInput, 'user-message');

    // 「生成中...」メッセージを表示し、アニメーションを開始
    const loadingMessage = appendMessage('生成中', 'loading-message');
    let dots = 0;
    const loadingInterval = setInterval(() => {
        dots = (dots + 1) % 4; // 0, 1, 2, 3 のループ
        loadingMessage.textContent = '生成中' + '.'.repeat(dots);
    }, 500); // 0.5秒ごとにアニメーション

    // 3秒待機（ハリボテの生成時間）
    setTimeout(async () => {
        clearInterval(loadingInterval); // アニメーションを停止
        loadingMessage.remove(); // 「生成中...」メッセージを削除

        if (userInput.trim() === 'メリークリスマス') {
            triggerSnowEffect();
        }

        // サーバーにPOSTリクエストを送信
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userInput }) // JSON形式で送信
        });

        // サーバーからのレスポンスを取得
        const data = await response.json();

        // AI応答を表示
        appendMessage(data.response, 'ai-message');
    }, 3000); // 3秒遅延

    // 入力欄をクリア
    document.getElementById('text-input').value = '';
}

const modal = document.getElementById("imageModal");
const closeButton = document.querySelector(".close");
const modalImage = document.getElementById("modalImage");

// チャットメッセージを追加する関数
function appendMessage(message, className) {
    const chatBox = document.getElementById('chat-area');
    const messageElement = document.createElement('div');

    // messageが配列ならボタンや画像を作成
    if (Array.isArray(message)) {
        const gridContainer = document.createElement('div'); // 画像用グリッドコンテナ
        gridContainer.classList.add('image-grid'); // CSSで定義したグリッドスタイルを適用

        message.forEach(data => {
            if (data.type === 'text') {
                const textElement = document.createElement('div');
                textElement.textContent = data.message;
                textElement.classList.add('chat-message', className);
                chatBox.appendChild(textElement);
            } else if (data.type === 'select_box') {
                const buttonElement = document.createElement('button');
                buttonElement.textContent = data.content;
                buttonElement.classList.add('chat-option-button');
                buttonElement.onclick = () => {
                    document.getElementById('text-input').value = data.content;
                    sendMessage();
                };
                chatBox.appendChild(buttonElement);
            } else if (data.type === 'grid_image') {
                const gridItem = document.createElement('div');
                gridItem.className = 'grid-item';

                const img = document.createElement('img');
                img.src = data.path;
                img.className = 'grid-image';

                // 画像クリック時の処理
                img.onclick = () => {
                    // data.name をチェックして対応するメッセージを設定
                    let message = ''; // スコープ外で変数を初期化

                    switch (data.name) {
                        case 'スリッパ ボア(BK2401)':
                            message = 'スリッパボア(BK2401)';
                            break;
                        case '解凍プレートシャープナー付きまな板':
                            message = '解凍プレートシャープナー付きまな板';
                            break;
                        default:
                            message = 'test';
                    }

                    // 設定したメッセージを入力欄に反映し、送信
                    document.getElementById('text-input').value = message;
                    sendMessage();
                };                

                const textContainer = document.createElement('div');
                textContainer.className = 'image-text-container';

                const itemNameElement = document.createElement('div');
                itemNameElement.className = 'item-name';
                itemNameElement.innerText = data.name;

                const itemPriceElement = document.createElement('div');
                itemPriceElement.className = 'item-price';
                itemPriceElement.innerText = data.price;

                const itemStockElement = document.createElement('div');
                if (data.stock == "◎在庫あり") {
                    itemStockElement.className = 'item-zaiko';
                } else if (data.stock == "△在庫残りわずか") {
                    itemStockElement.className = 'item-zaiko-short';
                } else {
                    itemStockElement.className = 'item-not-zaiko';
                }
                itemStockElement.innerText = data.stock;

                textContainer.appendChild(itemNameElement);
                textContainer.appendChild(itemPriceElement);
                textContainer.appendChild(itemStockElement);

                gridItem.appendChild(img);
                gridItem.appendChild(textContainer);
                gridContainer.appendChild(gridItem); // 修正ポイント
            } else if (data.type === 'image') {
                const imageContainer = document.createElement('div');

                const imgElement = document.createElement('img');
                imgElement.src = data.path;
                imgElement.onclick = () => {
                    const message = data.path.includes('map1.jpg')
                    if(message == true){
                        modalImage.src = imgElement.src; // クリックした画像のsrcをモーダルに設定
                        modal.classList.add('show'); // モーダルを表示
                        // アニメーションをトリガーするためのクラスを追加
                        modalImage.classList.add('animate');
                    }
                    else{
                        message ='test'
                        document.getElementById('text-input').value = message;
                        sendMessage();
                    }
                };

                imageContainer.appendChild(imgElement);
                chatBox.appendChild(imageContainer);
            }
        });

        if (gridContainer.children.length > 0) {
            chatBox.appendChild(gridContainer); // グリッド全体をチャットエリアに追加
        }
    } else {
        messageElement.textContent = message;
        messageElement.classList.add('chat-message', className);
        chatBox.appendChild(messageElement);
    }

    // スクロールを最下部に移動
    chatBox.scrollTop = chatBox.scrollHeight;

    return messageElement;
}

// 音声認識機能
const micButton = document.querySelector('.mic-button'); // 音声入力ボタン

micButton.addEventListener('click', () => {
    // 最初の送信時に例のテキストを非表示にする
    hideExampleTexts();

    // ブラウザが音声認識APIに対応しているか確認
    if (!('webkitSpeechRecognition' in window)) {
        alert('このブラウザは音声認識に対応していません。');
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'ja-JP'; // 日本語に設定
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // 録音開始時にクラスを追加
    micButton.classList.add('recording');

    recognition.start(); // 音声認識を開始
    console.log('音声認識を開始しました...');

    // 音声認識が成功した場合の処理
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript; // 認識結果を取得
        console.log('認識結果:', transcript);

        // 認識されたテキストを入力欄に反映
        document.getElementById('text-input').value = transcript;

        // 自動的に送信
        sendMessage();
    };

    // 音声認識中にエラーが発生した場合の処理
    recognition.onerror = (event) => {
        console.error('音声認識エラー:', event);
        alert('音声認識に失敗しました。再試行してください。');
    };

    // 音声認識が終了したときの処理
    recognition.onend = () => {
        console.log('音声認識が終了しました。');
        // 録音終了時にクラスを削除
        micButton.classList.remove('recording');
    };
});

// 閉じるボタンのイベント
closeButton.addEventListener("click", () => {
    modal.classList.remove('show'); // モーダルを非表示
    modalImage.classList.remove('animate'); // アニメーションクラスを削除（オプション）
});

// モーダル外をクリックして閉じる処理
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.remove('show'); // モーダルを非表示
        modalImage.classList.remove('animate'); // アニメーションクラスを削除（オプション）
    }
});

// 例のテキストを非表示にする関数
function hideExampleTexts() {
    const mainText = document.querySelector('.main-text');
    const exampleTexts = document.querySelector('.example-texts');

    if (mainText) mainText.style.display = 'none';
    if (exampleTexts) exampleTexts.style.display = 'none';
}

// 雪のエフェクトをトリガーする関数
function triggerSnowEffect() {
    if (isSnowing) return; // 既に雪が降っている場合は無視

    isSnowing = true;

    // 氷色の背景をチャットエリアに追加
    document.querySelector('.chat-area').classList.add('icy-background');

    // 吹き出しと入力エリアに雪のオーバーレイを追加
    document.querySelector('.chat-area').classList.add('snow-overlay');
    document.querySelector('.input-bar').classList.add('snow-overlay');

    // 既存のチャットメッセージに雪のオーバーレイを追加
    const existingMessages = document.querySelectorAll('.chat-message');
    existingMessages.forEach(message => {
        message.classList.add('snow-overlay');
    });

    // 雪のアニメーション用コンテナを作成
    const snowflakeContainer = document.createElement('div');
    snowflakeContainer.className = 'snowflake-container';

    // 雪片の数
    const snowflakeCount = 50;

    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';

        // 雪片のサイズをランダムに設定（5px〜15px）
        const size = Math.random() * 10 + 5;
        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;

        // 雪片の横位置をランダムに設定
        snowflake.style.left = `${Math.random() * 100}%`;

        // 雪片の降下速度をランダムに設定（5秒〜15秒）
        const duration = Math.random() * 10 + 5;
        snowflake.style.animationDuration = `${duration}s`;

        // 雪片のアニメーション開始遅延をランダムに設定
        snowflake.style.animationDelay = `${Math.random() * 5}s`;

        snowflakeContainer.appendChild(snowflake);
    }

    // 雪のアニメーションコンテナをボディに追加
    document.body.appendChild(snowflakeContainer);

    // 10秒間雪を降らせる
    setTimeout(() => {
        // 雪のアニメーションコンテナを削除（雪の降り続けを停止）
        if (document.body.contains(snowflakeContainer)) {
            document.body.removeChild(snowflakeContainer);
        }
    }, 10000); // 10000ミリ秒 = 10秒
}

// --- 新規追加部分 ---

// reload-button を取得
const reloadButton = document.querySelector('.reload-button');

// reload-button にクリックイベントを追加
reloadButton.addEventListener('click', () => {
    // チャットに「チャットでやり直しをします」というAIメッセージを追加
    sendReloadMessage();

    // 雪のエフェクトを解除
    removeSnowEffect();
});

// チャットで「やり直し」を促すAIメッセージを送信する関数
function sendReloadMessage() {
    // 「チャットでやり直しをします」というメッセージを表示
    appendMessage('チャットでやり直しをします', 'ai-message');
}

// 雪のエフェクトを解除する関数
function removeSnowEffect() {
    if (!isSnowing) return; // 雪が降っていない場合は何もしない

    isSnowing = false;

    // 氷色の背景をチャットエリアから削除
    document.querySelector('.chat-area').classList.remove('icy-background');

    // 吹き出しと入力エリアから雪のオーバーレイを削除
    document.querySelector('.chat-area').classList.remove('snow-overlay');
    document.querySelector('.input-bar').classList.remove('snow-overlay');

    // 既存のチャットメッセージから雪のオーバーレイを削除
    const existingMessages = document.querySelectorAll('.chat-message');
    existingMessages.forEach(message => {
        message.classList.remove('snow-overlay');
    });

    // 雪のアニメーションコンテナを削除（もし存在すれば）
    const snowflakeContainer = document.querySelector('.snowflake-container');
    if (snowflakeContainer) {
        document.body.removeChild(snowflakeContainer);
    }
}

// テキスト入力フィールドを取得
const textInput = document.getElementById('text-input');

// エンターキーを押したときにチャットを送信
textInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // デフォルトの改行動作を防止
        sendMessage(); // チャット送信
    }
});
