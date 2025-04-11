from flask import url_for


# リクエストに対して応答を生成する関数
def generate_message(user_message):
        

           #ーーーーーーーーーーーーーーーー最初のやつーーーーーーーーーーーーーーーーーーーーー
        if user_message == 'スリッパが欲しい' or user_message == 'スリッパが欲しい。':
            # 返す用のJSON。使う時はitemでfor文を回して、if data.type==img,data.type==textなどで判別してください！
            response_message = [
                    {"id":1,"type":'text',"message":'スリッパですね！カテゴリで絞り込みますか？売り場を表示しますか？'},
                    {"id":2,"type":'select_box',"content":'トイレスリッパで絞り込む'},
                    {"id":3,"type":'select_box',"content":'ハッシュタグで絞り込む'},
                    {"id":4,"type":'select_box',"content":'売り場の地図を見る'},
                    {"id":5,"type":'select_box',"content":'ここのメニューにはない'},
            ]

            return response_message

        elif user_message == 'トイレスリッパで絞り込む':

            response_message = [
                {"id":1,"type":'text',"message":'トイレスリッパですね！4件見つかりました！'},
                {"id":2,"type":'grid_image',"path":url_for('static', filename = 'images/image1.jpg'),"name":'スリッパ ボア(BK2401)',"price":'639円（税込）',"stock":'◎在庫あり'},
                {"id":3,"type":'grid_image',"path":url_for('static', filename = 'images/image2.jpg'),"name":'スリッパ(BO2301)',"price":'399円（税込）',"stock":'△在庫残りわずか'},
                {"id":4,"type":'grid_image',"path":url_for('static', filename = 'images/image3.jpg'),"name":'パブ―シュ（FE2301)',"price":'999円（税込）',"stock":'✖在庫なし'},
                {"id":5,"type":'grid_image',"path":url_for('static', filename = 'images/image4.jpg'),"name":'スリッパ(ラミーフ)',"price":'814円（税込）',"stock":'△在庫残りわずか'}
            ]
            return response_message
        
        elif user_message == 'スリッパボア(BK2401)':

            response_message = [
                {"id":1,"type":'text',"message":'スリッパボア（BK2401）ですね！売り場はこちらになります！画面タップで拡大表示できます。'},
                {"id":2,"type":'image',"path":url_for('static', filename = 'images/map1.jpg',)}
            ]
            return response_message


        elif user_message == 'スリッパボア(BK2401)':

            response_message = [
                {"id":1,"type":'text',"message":'スリッパボア（BK2401）ですね！売り場はこちらになります！画面タップで拡大表示できます。'},
                {"id":2,"type":'image',"path":url_for('static', filename = 'images/map_slippa.jpg',)}
            ]
            return response_message
        
        elif user_message == 'SNSでバズってるまな板が欲しい':

            response_message = [
                {"id":1,"type":'text',"message":'SNSで人気なまな板は店舗内で3件見つかりました。お探しのものはありましたか？'},
                {"id":2,"type":'grid_image',"path":url_for('static', filename = 'images/image5.jpg',),"name":'解凍プレートシャープナー付きまな板',"price":'1,490円～1,990円（税込）',"stock":'◎在庫あり'},
                {"id":3,"type":'grid_image',"path":url_for('static', filename = 'images/image6.jpg',),"name":'切れ味感動　魔法のまな板',"price":'1290円（税込）',"stock":'◎在庫あり'},
                {"id":4,"type":'grid_image',"path":url_for('static', filename = 'images/image7.jpg',),"name":'お皿になるまな板',"price":'999円（税込）',"stock":'✖在庫なし'},
                {"id":2,"type":'select_box',"content":'ここのメニューにはない'},
            ]
            return response_message
        
        elif user_message == '解凍プレートシャープナー付きまな板':

            response_message = [
                {"id":1,"type":'text',"message":'解凍プレートシャープナー付きまな板ですね！売り場はこちらになります！画面タップで拡大表示できます。'},
                {"id":2,"type":'image',"path":url_for('static', filename = 'images/map1.jpg',)},
            ]
            return response_message

        elif user_message == 'test':
            response_message = f"テスト用出力です！"
            return response_message
        
        elif user_message == 'こんにちは':
            response_message = f"こんにちは！なにかお困りのことはないですか？お気軽にお話しください！"
            return response_message
        
        elif user_message == 'メリークリスマス':
            response_message = f"*.🎅𝓜𝓮𝓻𝓻𝔂 𝓒𝓱𝓻𝓲𝓼𝓽𝓶𝓪𝓼🎄.*"
            return response_message

        else:
            response_message = f"サーバー応答: {user_message} に関連する情報を返します！"
            return response_message
