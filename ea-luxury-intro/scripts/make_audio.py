#!/usr/bin/env python3
"""Synthesizes the 12s sound design for EALuxuryIntro (deterministic, no external assets).

Cue sheet (seconds, synced to the animation timeline):
  0.0-12.0  deep cinematic drone, swells into the reveal
  2.0-3.8   atmospheric whoosh during smoke formation
  4.25      metallic impact as the EA monogram appears
  5.7-7.3   airy shimmer that follows the light sweep
  7.0-8.65  cinematic riser under the name reveal, soft sub hit at 8.65
  10.5-12   smooth fade-out
Output: public/audio/ea-intro.wav (48 kHz, 16-bit stereo)
"""
import os
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
DUR = 12.0
N = int(SR * DUR)
t = np.arange(N) / SR
rng = np.random.default_rng(1207)


def smooth(a, b, x):
    u = np.clip((x - a) / (b - a), 0, 1)
    return u * u * (3 - 2 * u)


def bandpass(x, lo, hi, order=2):
    sos = butter(order, [lo, hi], btype="band", fs=SR, output="sos")
    return sosfilt(sos, x)


def lowpass(x, fc, order=2):
    sos = butter(order, fc, btype="low", fs=SR, output="sos")
    return sosfilt(sos, x)


def sweep_noise(n, f0, f1, blocks=48):
    """White noise through a bandpass whose centre sweeps f0 -> f1 (exponentially)."""
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    zi = None
    bs = n // blocks + 1
    for b in range(blocks):
        s, e = b * bs, min(n, (b + 1) * bs)
        if s >= e:
            break
        fc = f0 * (f1 / f0) ** (b / (blocks - 1))
        lo, hi = max(20.0, fc / 1.6), min(SR / 2 - 100, fc * 1.6)
        sos = butter(2, [lo, hi], btype="band", fs=SR, output="sos")
        if zi is None:
            zi = np.zeros((sos.shape[0], 2))
        y, zi = sosfilt(sos, noise[s:e], zi=zi)
        out[s:e] = y
    return out / (np.max(np.abs(out)) + 1e-9)


def place(sig, start):
    out = np.zeros(N)
    i = int(start * SR)
    n = min(len(sig), N - i)
    if n > 0:
        out[i : i + n] = sig[:n]
    return out


def pan(mono, p):
    """p in [0,1] (0=left, 1=right), equal-power. p may be an array."""
    th = np.asarray(p) * np.pi / 2
    return np.stack([mono * np.cos(th), mono * np.sin(th)])


# ---------------------------------------------------------------- drone
f0 = 43.65  # F1
lfo = 0.5 + 0.5 * np.sin(2 * np.pi * 0.07 * t + 1.0)
tone = (
    0.60 * np.sin(2 * np.pi * f0 * t + 1.2 * np.sin(2 * np.pi * 0.11 * t))
    + 0.22 * np.sin(2 * np.pi * f0 * 2 * t + 0.4)
    + 0.18 * lfo * np.sin(2 * np.pi * f0 * 1.5 * t)
    + 0.07 * np.sin(2 * np.pi * f0 * 3.01 * t)
)
pad_l = bandpass(rng.standard_normal(N), 60, 320) * (0.5 + 0.5 * lfo)
pad_r = bandpass(rng.standard_normal(N), 60, 320) * (0.5 + 0.5 * (1 - lfo))
pad_l /= np.max(np.abs(pad_l)) + 1e-9
pad_r /= np.max(np.abs(pad_r)) + 1e-9
drone_env = np.interp(t, [0, 2.5, 4.2, 7, 9.5, 12], [0, 0.55, 0.7, 0.85, 0.75, 0.4])
drone = np.stack([(tone * 0.9 + 0.55 * pad_l), (tone * 0.9 + 0.55 * pad_r)]) * drone_env * 0.42

# ---------------------------------------------------------------- whoosh (2.0-3.8)
nw = int(1.8 * SR)
u = np.linspace(0, 1, nw)
whoosh = sweep_noise(nw, 250, 3200) * (np.sin(np.pi * u) ** 2.2) * 0.5
whoosh_st = pan(whoosh, 0.2 + 0.6 * u)
whoosh_mix = np.stack([place(whoosh_st[0], 2.0), place(whoosh_st[1], 2.0)])

# ---------------------------------------------------------------- metallic impact (4.25)
L = int(5.5 * SR)
tt = np.arange(L) / SR
boom_phase = 2 * np.pi * (38 * tt + 22 * (1 - np.exp(-6 * tt)) / 6)
boom = np.sin(boom_phase) * np.exp(-tt * 1.6) * 0.9
thud = np.sin(2 * np.pi * 110 * tt) * np.exp(-tt * 9) * 0.4
click = bandpass(rng.standard_normal(L), 1500, 9000) * np.exp(-tt * 90) * 0.7


def metal(detune):
    out = np.zeros(L)
    for ratio, decay, amp in [(1.0, 3.2, 0.5), (2.32, 2.6, 0.38), (4.17, 2.0, 0.26), (6.43, 1.6, 0.15), (9.1, 1.1, 0.10)]:
        out += amp * np.sin(2 * np.pi * 410 * ratio * (1 + detune) * tt + ratio) * np.exp(-decay * tt)
    return out * (1 - np.exp(-tt * 400))  # tiny attack ramp avoids a click


imp_l = boom + thud + click + 0.55 * metal(0.0)
imp_r = boom + thud + click * 0.9 + 0.55 * metal(0.0015)
impact = np.stack([place(imp_l, 4.25), place(imp_r, 4.25)]) * 0.62

# ---------------------------------------------------------------- shimmer with the light sweep (5.7-7.3)
ns = int(1.6 * SR)
us = np.linspace(0, 1, ns)
shimmer = sweep_noise(ns, 3000, 9000) * (np.sin(np.pi * us) ** 2) * 0.16
sh_st = pan(shimmer, 0.15 + 0.7 * us)
shimmer_mix = np.stack([place(sh_st[0], 5.7), place(sh_st[1], 5.7)])

# ---------------------------------------------------------------- riser (7.0-8.65) + soft sub hit
nr = int(1.65 * SR)
ur = np.linspace(0, 1, nr)
rise_noise = sweep_noise(nr, 500, 6000) * (ur ** 2.2) * 0.45
sweep_f = 150 * (1100 / 150) ** ur
rise_tone = np.sin(2 * np.pi * np.cumsum(sweep_f) / SR) * (ur ** 2.5) * 0.18
riser = rise_noise + rise_tone
riser_st = np.stack([place(riser * (1 - 0.15 * ur), 7.0), place(riser * (0.85 + 0.15 * ur), 7.0)])
nt = int(1.5 * SR)
tt2 = np.arange(nt) / SR
sub = np.sin(2 * np.pi * 55 * tt2) * np.exp(-tt2 * 3.2) * 0.35 * (1 - np.exp(-tt2 * 300))
sub_mix = np.stack([place(sub, 8.65), place(sub, 8.65)])

# ---------------------------------------------------------------- mix + reverb
dry = drone + whoosh_mix + impact + shimmer_mix + riser_st + sub_mix

ir_len = int(2.8 * SR)
ti = np.arange(ir_len) / SR
ir = [lowpass(rng.standard_normal(ir_len), 5200) * np.exp(-ti * 2.1) for _ in range(2)]
wet = np.stack([fftconvolve(dry[c], ir[c] / np.sqrt(np.sum(ir[c] ** 2)))[:N] for c in range(2)])
mix = dry + 0.22 * wet

# master envelope: soft start, smooth fade-out to silence
master = smooth(0.0, 0.4, t) * (1 - smooth(10.5, 12.0, t))
mix = mix * master
mix = np.tanh(mix * 1.1) / np.tanh(1.1)
mix = mix / (np.max(np.abs(mix)) + 1e-9) * 0.89

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "audio", "ea-intro.wav")
os.makedirs(os.path.dirname(out), exist_ok=True)
wavfile.write(out, SR, (mix.T * 32767).astype(np.int16))
print("wrote", os.path.normpath(out), f"{DUR:.1f}s")
