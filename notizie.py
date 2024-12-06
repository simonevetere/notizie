import os
import shutil
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
    id = fields.Str(required=True)
    categoria = fields.Str(required=True)

notizia_schema = NotiziaSchema()

def backup_database():
    """Crea un backup di notizie.json."""
    try:
        shutil.copy('notizie.json', 'notizie.json.bak')
        print("Backup del database creato con successo.")
    except Exception as e:
        print(f"Errore durante la creazione del backup: {e}")

def restore_database():
    """Ripristina il backup di notizie.json."""
    try:
        shutil.copy('notizie.json.bak', 'notizie.json')
        print("Database ripristinato dal backup.")
    except Exception as e:
        print(f"Errore durante il ripristino del backup: {e}")

@app.errorhandler(Exception)
def handle_error(e):
    """Gestisce tutti gli errori, ripristina il database in caso di errore 500."""
    print(e)
    if getattr(e, 'code', None) == 500:
        restore_database()
        return jsonify({'messaggio': 'Errore interno del server. Database ripristinato.'}), 500
    else:
        # Cancella il backup se non c'è stato un errore 500
        try:
            os.remove('notizie.json.bak')
        except FileNotFoundError:
            pass  # Il file non esiste, niente da fare
        return jsonify({'messaggio': 'Errore generico'}), getattr(e, 'code', 500)

@app.route('/api/notizie', methods=['GET'])
def ottenere_notizie():
    """
    Restituisce tutte le notizie nel database.
    """
    backup_database()
    try:
        notizie = db.all()
        for notizia in notizie:
            notizia['doc_id'] = notizia.doc_id  # Aggiungi il doc_id al dizionario
        return jsonify(notizie)
    except Exception as e:
        return handle_error(e)

@app.route('/api/notizie/<id>', methods=['GET'])
def ottenere_notizia(id):
    """
    Restituisce una singola notizia in base all'ID.
    """
    backup_database()
    try:
        # Tenta di convertire l'ID in un intero
        id = int(id)
        notizia = db.get(doc_id=id)
    except ValueError:
        n = Query()
        # Se la conversione fallisce, cerca con id=
        notizia = db.search(n.id.matches(id))
    except Exception as e:
        return handle_error(e)

    if notizia:
        return jsonify(notizia)
    else:
        return jsonify({'messaggio': 'Notizia non trovata'}), 404

@app.route('/api/notizie', methods=['POST'])
def creare_notizia():
    """
    Inserisce una nuova notizia nel database.
    """
    backup_database()
    try:
        notizia = notizia_schema.load(request.get_json())
        db.insert(notizia)
        return jsonify(notizia), 201
    except ValidationError as err:
        return jsonify({'messaggio': 'Dati non validi', 'errori': err.messages}), 400
    except Exception as e:
        return handle_error(e)

@app.route('/api/notizie/<int:id>', methods=['DELETE'])
def eliminare_notizia(id):
    """
    Elimina una notizia in base all'ID.
    """
    backup_database()
    try:
        if db.remove(doc_ids=[id]):
            return jsonify({'messaggio': 'Notizia eliminata'}), 200
        else:
            return jsonify({'messaggio': 'Notizia non trovata'}), 404
    except Exception as e:
        return handle_error(e)

if __name__ == '__main__':
    app.run(port=8600)