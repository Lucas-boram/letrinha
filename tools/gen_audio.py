"""Gera as vozes da Cora (pt-BR, feminina) em audio/*.mp3 com edge-tts.
Uso: python tools/gen_audio.py
"""
import asyncio
import os
import edge_tts

VOICE = "pt-BR-FranciscaNeural"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "audio")
os.makedirs(OUT, exist_ok=True)

ACCENT = {"A": "á", "E": "ê", "I": "í", "O": "ô", "U": "ú"}

def say_syllable(s):
    """BA -> 'bá': o acento força a leitura do som, e não do nome das letras."""
    return s[:-1].lower() + ACCENT[s[-1]]

VOWELS = list("AEIOU")
SYL = [c + v for c in "BPMLTDS" for v in VOWELS] + ["CA", "CO", "CU"]
WORDS = ["CASA", "GATO", "LUA", "UVA", "SAPO", "BOLA", "PATO", "DADO", "BOTA", "LOBO", "MALA", "FOGO",
         "VACA", "SOPA", "BOLO", "CAMA", "BANANA", "CAVALO", "TOMATE", "MACACO", "SAPATO", "BONECA",
         "CAMELO", "ABACATE", "TELEFONE", "PIRATA"]

PHRASES = {
    "intro_listen": "Toque no que eu falar!",
    "intro_build": "Monte a palavra!",
    "intro_missing": "Qual sílaba está faltando?",
    "ok1": "Muito bem!",
    "ok2": "Isso mesmo!",
    "ok3": "Parabéns!",
    "ok4": "Que legal!",
    "ok5": "Você arrasou!",
    "err1": "Quase! Escute de novo.",
    "err2": "Hmm, tente outra vez.",
    "perfect": "Perfeito! Você ganhou três estrelas!",
    "good": "Muito bom! Vamos jogar mais?",
    "try": "Boa tentativa! Vamos de novo?",
    "hello": "Oi! Eu sou a Cora. Vamos brincar com as letras?",
}

async def make(name, text, rate="-8%", pitch="+0Hz"):
    path = os.path.join(OUT, name + ".mp3")
    await edge_tts.Communicate(text, VOICE, rate=rate, pitch=pitch).save(path)

async def main():
    jobs = []
    for v in VOWELS:
        jobs.append(make(v.lower(), ACCENT[v], rate="-20%"))
    for s in SYL:
        jobs.append(make(s.lower(), say_syllable(s), rate="-20%"))
    for w in WORDS:
        jobs.append(make(w.lower(), w.lower(), rate="-15%"))
    for k, t in PHRASES.items():
        jobs.append(make(k, t, rate="-5%", pitch="+2Hz"))
    for i in range(0, len(jobs), 8):
        await asyncio.gather(*jobs[i:i + 8])
    print(f"{len(jobs)} arquivos gerados")

asyncio.run(main())
