from flask import Flask, request, jsonify
from tinydb import TinyDB, Query
from flask_cors import CORS
from marshmallow import Schema, fields, ValidationError

app = Flask(__name__)
CORS(app)
db = TinyDB('notizie.json')

# Schema per la validazione dei dati
class NotiziaSchema(Schema):
    titolo = fields.Str(required=True, validate=lambda n: len(n) > 5)
    contenuto = fields.Str(required=True)
    immagine = fields.Str(required=False)
    video = fields.Str(required=False)

notizia_schema = NotiziaSchema()

@app.errorhandler(400)
def bad_request(error):
    return jsonify({'messaggio': 'Richiesta non valida', 'errore': str(error)}), 400

@app.route('/api/notizie', methods=['GET'])
def ottenere_notizie():
    """
    Restituisce tutte le notizie nel database.
    """
    notizie = db.all()
    for notizia in notizie:
        notizia['doc_id'] = notizia.doc_id  # Aggiungi il doc_id al dizionario
    return jsonify(notizie)

@app.route('/api/notizie/<int:id>', methods=['GET'])
def ottenere_notizia(id):
    """
    Restituisce una singola notizia in base all'ID.
    """
    notizia = db.get(doc_id=id)
    if notizia:
        return jsonify(notizia)
    else:
        return jsonify({'messaggio': 'Notizia non trovata'}), 404

@app.route('/api/notizie', methods=['POST'])
def creare_notizia():
    """
    Inserisce una nuova notizia nel database.
    """
    try:
        notizia = notizia_schema.load(request.get_json())
        print(notizia_schema.load(request.get_json()))
        db.insert(notizia)
        return jsonify(notizia), 201
    except ValidationError as err:
        return jsonify({'messaggio': 'Dati non validi', 'errori': err.messages}), 400

@app.route('/api/notizie/<int:id>', methods=['DELETE'])
def eliminare_notizia(id):
    """
    Elimina una notizia in base all'ID.
    """
    if db.remove(doc_ids=[id]):
        return jsonify({'messaggio': 'Notizia eliminata'}), 200
    else:
        return jsonify({'messaggio': 'Notizia non trovata'}), 404

if __name__ == '__main__':
    app.run(port=8600)
