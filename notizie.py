import os
import shutil
from flask import Flask, request, jsonify, render_template
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
    restore_database()
    return jsonify({'messaggio': 'Errore interno del server. Database ripristinato.'}), 500

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

@app.route('/preview')
def get_preview():
    """
    Restituisce l'HTML dinamico per una singola notizia, 
    leggendo le informazioni dall'URL e includendo i meta tag per la preview.
    """
    titolo = request.args.get('titolo')
    contenuto = request.args.get('contenuto')
    immagine = request.args.get('immagine')
    video = request.args.get('video')
    redirect = request.args.get('redirect')

    # Validazione basilare dei dati
    if not titolo  or not redirect:
        return "Errore: titolo e redirect sono obbligatori", 400

    # Crea un dizionario con i dati della notizia
    notizia = {
        'titolo': titolo,
        'contenuto': contenuto,
        'immagine': immagine,
        'video': video,
        'redirect': redirect
    }

    return render_template('preview.html', notizia=notizia)

backup_database()

if __name__ == '__main__':
    app.run(port=8600)