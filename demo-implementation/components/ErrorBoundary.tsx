"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("RUNdio ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-700 p-8 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-black mb-2">画面の読み込みに失敗しました</h2>
          <p className="text-sm text-slate-500 mb-6">
            {this.state.error?.message ?? "不明なエラーが発生しました"}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.href = "/home";
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-700 transition-colors"
          >
            ホームに戻る
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
