

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-800">科学技術研究所</h1>
          <p className="text-gray-600 mt-1">最先端技術の解説</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              表面プラズモン
            </h1>
            <p className="text-xl text-gray-600">
              光と金属の界面で起こる神秘的な現象
            </p>
          </div>
          
          <div className="w-full h-64 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-xl mb-6 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-6xl mb-2">🌊</div>
              <p className="text-lg font-semibold">表面プラズモン波</p>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">表面プラズモンとは</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            表面プラズモンは、金属と誘電体の界面で励起される電子の集団振動現象です。
            光が金属表面に照射されると、金属内の自由電子が集団的に振動し、
            特定の条件下で表面に沿って伝播する電磁波モードが形成されます。
          </p>
          <p className="text-gray-700 leading-relaxed">
            この現象は、ナノテクノロジー、バイオセンシング、光学デバイスなど、
            様々な分野で革新的な応用が期待されています。
          </p>
        </section>

        {/* Types of Plasmons */}
        <section className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <h3 className="text-xl font-bold text-gray-900">表面プラズモン共鳴（SPR）</h3>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              金属薄膜と誘電体界面で起こる共鳴現象。入射光の角度や波長を調整することで、
              表面プラズモンを効率的に励起できます。
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">主な応用</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• バイオセンシング</li>
                <li>• 分子相互作用解析</li>
                <li>• 医療診断デバイス</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
              <h3 className="text-xl font-bold text-gray-900">局在表面プラズモン共鳴（LSPR）</h3>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              金属ナノ粒子において電子が局在化して振動する現象。
              粒子サイズや形状により共鳴波長を制御可能です。
            </p>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">主な応用</h4>
              <ul className="text-purple-800 text-sm space-y-1">
                <li>• 光触媒</li>
                <li>• イメージング技術</li>
                <li>• 色素増感太陽電池</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Research Highlights */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">最新研究動向</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                銀ナノ構造配列による電場増強効果
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                最新の研究では、銀ナノ構造を規則的に配列することで、
                表面プラズモンによる電場増強効果を大幅に向上させることに成功しています。
                この技術により、分光分析の感度が飛躍的に向上しました。
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ナノテクノロジーとの融合
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                表面プラズモン技術は、ナノテクノロジーと組み合わせることで、
                従来では不可能だった高精度センシングや新材料開発を可能にしています。
              </p>
            </div>
          </div>
        </section>

        {/* Applications */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">産業応用分野</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="text-4xl mb-3">🔬</div>
              <h3 className="font-semibold text-gray-900 mb-2">バイオセンシング</h3>
              <p className="text-gray-700 text-sm">
                タンパク質や DNA の検出、
                医療診断への応用
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="text-4xl mb-3">📡</div>
              <h3 className="font-semibold text-gray-900 mb-2">通信技術</h3>
              <p className="text-gray-700 text-sm">
                光通信デバイス、
                高速データ伝送
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-semibent text-gray-900 mb-2">エネルギー</h3>
              <p className="text-gray-700 text-sm">
                太陽電池効率向上、
                光触媒技術
              </p>
            </div>
          </div>
        </section>

        {/* Future Prospects */}
        <section className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-6">将来展望</h2>
          <p className="leading-relaxed mb-4">
            表面プラズモン技術は、量子技術やAI技術との融合により、
            さらなる革新的な応用が期待されています。
          </p>
          <p className="leading-relaxed">
            特に、超高感度センシング、量子情報処理、
            次世代光コンピューティングなどの分野で、
            breakthrough となる可能性を秘めています。
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gray-400">
            © 2024 科学技術研究所 - 表面プラズモン研究
          </p>
        </div>
      </footer>
    </div>
  );
}
