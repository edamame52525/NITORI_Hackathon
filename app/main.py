#実行ファイル
from app import create_app
from flask import Flask,render_template,jsonify,request
from .utils import generate_message

app = create_app()

# ルートの定義
@app.route('/')
def index():
    return render_template('base.html')

@app.route('/chat', methods=['GET','POST'])
def chat():
    # サーバ読み込み時の処理
    if request.method == 'GET':
        return render_template('chat.html')
    
    # ポスト時の処理
    elif request.method == 'POST':
        data = request.get_json()
        user_message = data.get('message', '')
        response_message = generate_message(user_message)
        return jsonify({'response':response_message})


# アプリのエントリーポイント
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000 ,debug=True)