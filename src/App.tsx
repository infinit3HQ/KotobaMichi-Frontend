function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-10 max-w-md w-full text-center">
          <h1 className="text-4xl font-bold text-purple-700 mb-4">
            Welcome to KotobaMichi(言葉道)
          </h1>
          <p className="text-gray-700 mb-6">
            KotobaMichi(言葉道) is your go-to platform for language exchange and
            cultural交流. Connect with native speakers, practice your skills,
            and explore new languages together!
          </p>
          <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold shadow hover:bg-purple-700 transition">
            Get Started
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
