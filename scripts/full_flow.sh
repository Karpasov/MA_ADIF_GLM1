#!/bin/bash
# Full flow: clear, reload, start, play 10 rounds via eval, take screenshots
set -e

echo "=== Clearing localStorage ==="
agent-browser storage local clear 2>&1 | tail -1

echo "=== Reloading page ==="
agent-browser reload 2>&1 | tail -1
sleep 1.5

echo "=== Start screen snapshot ==="
agent-browser snapshot -i 2>&1 | head -8

# Click start button using semantic locator (more robust)
echo ""
echo "=== Clicking start button ==="
agent-browser find role button click --name "יאללה, מתחילים" 2>&1 | tail -1
sleep 1.5

echo ""
echo "=== Choice screen snapshot ==="
agent-browser snapshot -i 2>&1 | head -10

# Take screenshot of choice screen
agent-browser screenshot /home/z/my-project/download/02-choice.png --full 2>&1 | tail -1

# Play 10 rounds
echo ""
echo "=== Playing 10 rounds ==="
for i in 1 2 3 4 5 6 7 8 9 10; do
  sleep 1.0
  
  result=$(agent-browser eval "(() => {
    const cards = document.querySelectorAll('button[data-side]');
    if (cards.length === 0) {
      return 'NO_CARDS';
    }
    cards[0].click();
    return 'CLICKED';
  })()" 2>&1 | tail -1)
  
  echo "Round $i: $result"
  
  if [[ "$result" == "NO_CARDS" ]]; then
    echo "Reached results screen"
    break
  fi
done

sleep 1.5
echo ""
echo "=== Final state ==="
agent-browser snapshot -i 2>&1 | head -20

# Take screenshot of results screen
agent-browser screenshot /home/z/my-project/download/03-results.png --full 2>&1 | tail -1
