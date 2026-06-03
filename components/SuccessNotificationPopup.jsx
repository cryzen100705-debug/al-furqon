"use client";

import { FaCheck, FaBell, FaTimes } from "react-icons/fa";

export default function SuccessNotificationPopup({
  show,
  onClose,
  title = "Pemberitahuan Berhasil Dikirim",
  message = "Pemberitahuan sudah berhasil dikirim kepada santri.",
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 px-4 backdrop-blur-md">
      <div className="success-popup relative w-full max-w-md overflow-hidden rounded-[32px] border border-emerald-100 bg-white p-7 text-center shadow-[0_30px_100px_rgba(0,0,0,0.25)]">
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-red-50 hover:text-red-500"
        >
          <FaTimes />
        </button>

        {/* BACKGROUND ORNAMENT */}
        <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-emerald-100 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-yellow-100 blur-3xl" />

        <div className="relative z-10">
          {/* ANIMATION CHARACTER */}
          <div className="mx-auto flex h-64 w-full items-center justify-center">
            <div className="success-character">
              {/* HALO */}
              <div className="halo-circle" />

              {/* STARS */}
              <span className="star star-1">✦</span>
              <span className="star star-2">✦</span>
              <span className="star star-3">✦</span>

              {/* BELL */}
              <div className="bell-wrap">
                <FaBell className="bell-icon" />
                <span className="bell-wave wave-1" />
                <span className="bell-wave wave-2" />
              </div>

              {/* BODY */}
              <div className="person">
                <div className="cap">
                  <div className="cap-top" />
                  <div className="cap-body" />
                </div>

                <div className="head">
                  <div className="eye eye-left" />
                  <div className="eye eye-right" />
                  <div className="smile" />
                  <div className="blush blush-left" />
                  <div className="blush blush-right" />
                </div>

                <div className="body">
                  <div className="neck-line" />
                  <div className="button btn-1" />
                  <div className="button btn-2" />
                </div>

                <div className="arm arm-left" />
                <div className="arm arm-right" />
                <div className="hand hand-left" />
                <div className="hand hand-right" />

                <div className="leg leg-left" />
                <div className="leg leg-right" />
                <div className="foot foot-left" />
                <div className="foot foot-right" />
              </div>

              {/* CHECK */}
              <div className="check-badge">
                <FaCheck />
              </div>
            </div>
          </div>

          {/* TEXT */}
          <h2 className="mt-2 text-2xl font-black leading-tight text-[#102A1F] sm:text-3xl">
            {title}
          </h2>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-500">
            {message}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#064E3B] px-6 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#086B4F]"
          >
            Selesai
          </button>
        </div>

        <style jsx>{`
          .success-popup {
            animation: popupIn 0.45s cubic-bezier(0.22, 1, 0.36, 1);
          }

          .success-character {
            position: relative;
            width: 220px;
            height: 240px;
            animation: floatCharacter 2.8s ease-in-out infinite;
          }

          .halo-circle {
            position: absolute;
            left: 52px;
            top: 5px;
            width: 116px;
            height: 116px;
            border: 4px dashed #059669;
            border-radius: 999px;
            opacity: 0.9;
            animation: rotateHalo 4s linear infinite;
          }

          .star {
            position: absolute;
            color: #f59e0b;
            font-size: 24px;
            animation: twinkle 1.6s ease-in-out infinite;
          }

          .star-1 {
            left: 28px;
            top: 70px;
          }

          .star-2 {
            right: 32px;
            top: 86px;
            animation-delay: 0.35s;
          }

          .star-3 {
            left: 44px;
            top: 138px;
            animation-delay: 0.75s;
          }

          .bell-wrap {
            position: absolute;
            right: 18px;
            top: 32px;
            width: 54px;
            height: 54px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 18px;
            background: #facc15;
            color: #064e3b;
            box-shadow: 0 14px 35px rgba(250, 204, 21, 0.35);
            animation: bellShake 0.9s ease-in-out infinite;
          }

          .bell-icon {
            font-size: 25px;
          }

          .bell-wave {
            position: absolute;
            border: 3px solid #059669;
            border-left: 0;
            border-bottom: 0;
            width: 18px;
            height: 18px;
            border-radius: 999px;
            opacity: 0.8;
          }

          .wave-1 {
            right: -13px;
            top: 12px;
            animation: wavePulse 1s ease-in-out infinite;
          }

          .wave-2 {
            right: -22px;
            top: 7px;
            width: 28px;
            height: 28px;
            animation: wavePulse 1s ease-in-out infinite 0.2s;
          }

          .person {
            position: absolute;
            left: 50%;
            top: 82px;
            width: 130px;
            height: 145px;
            transform: translateX(-50%);
          }

          .cap {
            position: absolute;
            left: 37px;
            top: -30px;
            z-index: 4;
            width: 56px;
            height: 42px;
          }

          .cap-top {
            position: absolute;
            left: 5px;
            top: 0;
            width: 46px;
            height: 14px;
            border-radius: 8px 8px 4px 4px;
            background: #222;
          }

          .cap-body {
            position: absolute;
            left: 0;
            top: 8px;
            width: 56px;
            height: 32px;
            border-radius: 8px 8px 4px 4px;
            background: #2b2b2b;
          }

          .head {
            position: absolute;
            left: 28px;
            top: 0;
            z-index: 3;
            width: 76px;
            height: 82px;
            border-radius: 50%;
            background: #f8c56b;
            box-shadow: inset 0 -6px 0 rgba(0, 0, 0, 0.04);
          }

          .eye {
            position: absolute;
            top: 33px;
            width: 18px;
            height: 18px;
            border-radius: 999px;
            background: #fff;
          }

          .eye::after {
            content: "";
            position: absolute;
            right: 2px;
            top: 4px;
            width: 8px;
            height: 8px;
            border-radius: 999px;
            background: #333;
            animation: eyeMove 2s ease-in-out infinite;
          }

          .eye-left {
            left: 22px;
          }

          .eye-right {
            right: 18px;
          }

          .smile {
            position: absolute;
            left: 26px;
            top: 52px;
            width: 30px;
            height: 16px;
            border-bottom: 5px solid #9a6116;
            border-radius: 0 0 999px 999px;
          }

          .blush {
            position: absolute;
            top: 48px;
            width: 16px;
            height: 10px;
            border-radius: 999px;
            background: #f2a56f;
            opacity: 0.8;
          }

          .blush-left {
            left: 10px;
          }

          .blush-right {
            right: 8px;
          }

          .body {
            position: absolute;
            left: 24px;
            top: 76px;
            z-index: 2;
            width: 84px;
            height: 78px;
            border-radius: 18px 18px 12px 12px;
            background: #dff7f0;
          }

          .neck-line {
            position: absolute;
            left: 41px;
            top: 12px;
            width: 2px;
            height: 55px;
            background: #70cbb3;
          }

          .button {
            position: absolute;
            left: 37px;
            width: 9px;
            height: 9px;
            border-radius: 999px;
            background: #047857;
          }

          .btn-1 {
            top: 25px;
          }

          .btn-2 {
            top: 48px;
          }

          .arm {
            position: absolute;
            top: 78px;
            width: 32px;
            height: 78px;
            border-radius: 18px;
            background: #dff7f0;
          }

          .arm-left {
            left: -1px;
            transform: rotate(5deg);
          }

          .arm-right {
            right: -1px;
            transform: rotate(-5deg);
          }

          .hand {
            position: absolute;
            top: 150px;
            z-index: 3;
            width: 33px;
            height: 33px;
            border-radius: 999px;
            background: #f8c56b;
          }

          .hand-left {
            left: -4px;
          }

          .hand-right {
            right: -4px;
          }

          .leg {
            position: absolute;
            top: 144px;
            width: 35px;
            height: 48px;
            background: #dff7f0;
          }

          .leg-left {
            left: 37px;
          }

          .leg-right {
            right: 36px;
          }

          .foot {
            position: absolute;
            top: 184px;
            width: 42px;
            height: 22px;
            border-radius: 999px;
            background: #262626;
          }

          .foot-left {
            left: 28px;
          }

          .foot-right {
            right: 26px;
          }

          .check-badge {
            position: absolute;
            left: 50%;
            top: 5px;
            z-index: 8;
            display: flex;
            height: 58px;
            width: 58px;
            align-items: center;
            justify-content: center;
            border: 5px solid white;
            border-radius: 999px;
            background: #22c55e;
            color: white;
            font-size: 24px;
            box-shadow: 0 14px 35px rgba(34, 197, 94, 0.35);
            animation: checkPop 1.5s ease-in-out infinite;
          }

          @keyframes popupIn {
            from {
              opacity: 0;
              transform: translateY(30px) scale(0.94);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes floatCharacter {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @keyframes rotateHalo {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes twinkle {
            0%,
            100% {
              transform: scale(1);
              opacity: 0.7;
            }
            50% {
              transform: scale(1.35) rotate(12deg);
              opacity: 1;
            }
          }

          @keyframes bellShake {
            0%,
            100% {
              transform: rotate(0deg);
            }
            25% {
              transform: rotate(8deg);
            }
            75% {
              transform: rotate(-8deg);
            }
          }

          @keyframes wavePulse {
            0% {
              opacity: 0;
              transform: scale(0.8);
            }
            50% {
              opacity: 1;
              transform: scale(1);
            }
            100% {
              opacity: 0;
              transform: scale(1.25);
            }
          }

          @keyframes eyeMove {
            0%,
            100% {
              transform: translateX(0);
            }
            50% {
              transform: translateX(-3px);
            }
          }

          @keyframes checkPop {
            0%,
            100% {
              transform: translateX(-50%) scale(1);
            }
            50% {
              transform: translateX(-50%) scale(1.12);
            }
          }
        `}</style>
      </div>
    </div>
  );
}