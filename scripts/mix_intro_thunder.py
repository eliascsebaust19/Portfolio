#!/usr/bin/env python3
"""Layer original synthesized thunder over the base 12-second intro score.

Usage: python scripts/mix_intro_thunder.py original.wav public/audio/ea-intro.wav
"""
from array import array
import json
import math
from pathlib import Path
import random
import sys
import wave


def thunder(rate, seed, pitch):
    """A dry electrical crack with a longer, low-frequency rolling tail."""
    rng = random.Random(seed)
    crack_filter = body = rumble = phase = 0.0
    for i in range(round(1.6 * rate)):
        t = i / rate
        noise = rng.uniform(-1, 1)
        crack_filter += 0.14 * (noise - crack_filter)
        body += 0.065 * (noise - body)
        rumble += 0.016 * (body - rumble)
        phase += 2 * math.pi * (pitch + 32 * math.exp(-t * 12)) / rate
        crack = (noise - crack_filter) * 0.34 * math.exp(-t * 54)
        snap = 0.0
        for delay, strength in ((0.026, 0.48), (0.061, 0.25), (0.113, 0.18)):
            if t >= delay:
                snap += strength * math.exp(-(t - delay) * 75)
        crack += body * snap
        roll = (math.sin(phase) * 0.33 + body * 0.85 + rumble * 0.8)
        roll *= math.exp(-t * 3.9) * (0.84 + 0.16 * math.cos(t * 42))
        yield (crack + roll) * min(1, t / 0.003) * min(1, (1.6 - t) / 0.12)


def mix(source, destination):
    project = Path(__file__).resolve().parents[1]
    cues = json.loads((project / "src/components/Intro/strikeCues.json").read_text())
    with wave.open(str(source), "rb") as original:
        params = original.getparams()
        if params.nchannels != 2 or params.sampwidth != 2:
            raise ValueError("Expected a stereo 16-bit PCM base soundtrack")
        samples = array("h", original.readframes(params.nframes))
    if sys.byteorder != "little":
        samples.byteswap()
    mixed = [value / 32768 * 0.68 for value in samples]
    for letter, seed, pitch, pan in (("E", 120, 58, -0.28), ("A", 829, 46, 0.28)):
        start = round(cues[letter] * params.framerate)
        for i, amplitude in enumerate(thunder(params.framerate, seed, pitch), start):
            mixed[2 * i] += amplitude * (0.8 - pan * 0.4)
            mixed[2 * i + 1] += amplitude * (0.8 + pan * 0.4)
    peak = max(abs(value) for value in mixed)
    gain = min(1, 0.92 / peak) if peak else 1
    pcm = array("h", (round(value * gain * 32767) for value in mixed))
    if sys.byteorder != "little":
        pcm.byteswap()
    with wave.open(str(destination), "wb") as output:
        output.setparams(params)
        output.writeframes(pcm.tobytes())


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    mix(*sys.argv[1:])
