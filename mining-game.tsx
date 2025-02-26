"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { Diamond, Bomb, Coins } from "lucide-react"

function calculatePayout(bet: number, mines: number, diamonds: number): number {
  let M = 1
  for (let i = 0; i < diamonds; i++) {
    M = (M * (25 - i)) / (25 - mines - i)
  }
  return bet * M
}

export default function MiningGame() {
  const [amount, setAmount] = useState("0")
  const [mines, setMines] = useState("3")
  const [gameState, setGameState] = useState<"idle" | "playing" | "lost" | "won">("idle")
  const [grid, setGrid] = useState<Array<"hidden" | "gem" | "bomb">>(Array(25).fill("hidden"))
  const [revealedTiles, setRevealedTiles] = useState<number[]>([])
  const [coins, setCoins] = useState(10) // Default balance set to 10
  const [currentBet, setCurrentBet] = useState(0)
  const [currentPayout, setCurrentPayout] = useState(0)

  useEffect(() => {
    const savedCoins = localStorage.getItem("miningGameCoins")
    if (savedCoins) {
      setCoins(Number.parseFloat(savedCoins))
    } else {
      localStorage.setItem("miningGameCoins", "10") // Set initial balance in local storage
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("miningGameCoins", coins.toString())
  }, [coins])

  const handleAmountChange = (operation: "half" | "double") => {
    const currentAmount = Number.parseFloat(amount)
    const newAmount = operation === "half" ? currentAmount / 2 : currentAmount * 2
    setAmount(newAmount.toFixed(2))
  }

  const initializeGame = () => {
    const betAmount = Number.parseFloat(amount)
    if (isNaN(betAmount) || betAmount <= 0) {
      alert("Please enter a valid bet amount.")
      return
    }
    if (coins < betAmount) {
      alert("Not enough coins to place this bet!")
      return
    }

    setCoins((prevCoins) => prevCoins - betAmount)
    setCurrentBet(betAmount)
    setCurrentPayout(betAmount)

    const newGrid = Array(25).fill("hidden")
    const bombPositions = []
    const numMines = Number.parseInt(mines)

    while (bombPositions.length < numMines) {
      const position = Math.floor(Math.random() * 25)
      if (!bombPositions.includes(position)) {
        bombPositions.push(position)
        newGrid[position] = "bomb"
      }
    }

    for (let i = 0; i < 25; i++) {
      if (newGrid[i] === "hidden") {
        newGrid[i] = "gem"
      }
    }

    setGrid(newGrid)
    setRevealedTiles([])
    setGameState("playing")
  }

  const handleTileClick = (index: number) => {
    if (gameState !== "playing" || revealedTiles.includes(index)) return

    const newRevealedTiles = [...revealedTiles, index]
    setRevealedTiles(newRevealedTiles)

    if (grid[index] === "bomb") {
      setGameState("lost")
      setRevealedTiles([...Array(25).keys()])
      setCurrentPayout(0)
    } else {
      const safeReveals = newRevealedTiles.length
      const newPayout = calculatePayout(currentBet, Number.parseInt(mines), safeReveals)
      setCurrentPayout(newPayout)

      if (safeReveals === 25 - Number.parseInt(mines)) {
        setGameState("won")
        setRevealedTiles([...Array(25).keys()])
        setCoins((prevCoins) => prevCoins + newPayout)
      }
    }
  }

  const handleCashout = () => {
    if (gameState === "playing") {
      setCoins((prevCoins) => prevCoins + currentPayout)
      setGameState("won")
      setRevealedTiles([...Array(25).keys()])
    }
  }

  const claimCoins = () => {
    setCoins((prevCoins) => prevCoins + 10)
  }

  const resetGame = () => {
    setGameState("idle")
    setGrid(Array(25).fill("hidden"))
    setRevealedTiles([])
    setCurrentBet(0)
    setCurrentPayout(0)
  }

  return (
    <div className="text-white p-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">


        {/* Game Grid */}
        <div className="grid grid-cols-5 gap-2">
          {grid.map((tile, index) => (
            <motion.button
              key={index}
              className={`aspect-square rounded-lg p-4 flex items-center justify-center
                ${revealedTiles.includes(index) ? "bg-slate-800" : "bg-slate-800 hover:bg-slate-700"}`}
              onClick={() => handleTileClick(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={gameState !== "playing"}
            >
              <AnimatePresence>
                {revealedTiles.includes(index) && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    {tile === "gem" ? (
                      <Diamond
                        className={`w-8 h-8 ${revealedTiles.includes(index) ? "text-green-500" : "text-slate-600"}`}
                      />
                    ) : (
                      <div className="relative">
                        <div className="absolute inset-0 animate-ping">
                          <Bomb className="w-8 h-8 text-red-500" />
                        </div>
                        <Bomb className="w-8 h-8 text-red-500" />
                      </div>
                    )}
                  </motion.div>
                )}
                {!revealedTiles.includes(index) && <Diamond className="w-8 h-8 text-slate-600" />}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>


        <div className="space-y-6">
          {/* Controls */}
          <div className="flex gap-2 bg-slate-800 p-1 rounded-full">
            <Button variant="ghost" className="flex-1 rounded-full bg-slate-700">
              Manual
            </Button>
            <Button variant="ghost" className="flex-1 rounded-full text-slate-400" disabled>
              Auto
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-slate-400">Amount</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-slate-800 border-slate-700 pl-8"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500">$</span>
              </div>
              <Button
                variant="outline"
                className="border-slate-700 text-slate-400"
                onClick={() => handleAmountChange("half")}
              >
                ½
              </Button>
              <Button
                variant="outline"
                className="border-slate-700 text-slate-400"
                onClick={() => handleAmountChange("double")}
              >
                2×
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-slate-400">Mines</label>
            <Select value={mines} onValueChange={setMines}>
              <SelectTrigger className="bg-slate-800 border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {gameState === "idle" && (
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-6 text-lg" onClick={initializeGame}>
              Play
            </Button>
          )}

          {gameState === "playing" && (
            <Button
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 py-6 text-lg"
              onClick={handleCashout}
            >
              Cash Out ${currentPayout.toFixed(2)}
            </Button>
          )}

          {(gameState === "won" || gameState === "lost") && (
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 text-lg" onClick={resetGame}>
              Play Again
            </Button>
          )}

          <div className="flex items-center justify-between bg-slate-800 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Coins className="text-yellow-500" />
              <span className="text-xl font-bold">${coins.toFixed(2)}</span>
            </div>
            {coins < 1 && (
              <Button onClick={claimCoins} className="bg-yellow-500 hover:bg-yellow-600 text-slate-900">
                Claim $10
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

