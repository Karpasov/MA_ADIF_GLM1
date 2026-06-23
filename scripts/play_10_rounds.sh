#!/bin/bash
# Play 10 rounds by directly clicking the first card via eval
set -e

for i in 1 2 3 4 5 6 7 8 9 10; do
  # Wait a bit for animation to settle
  sleep 1.0
  
  # Check if we're still on the choice screen by looking for data-side attribute
  result=$(agent-browser eval "(() => {
    const cards = document.querySelectorAll('button[data-side]');
    if (cards.length === 0) {
      return 'NO_CARDS';
    }
    // Click the first card (right side in RTL)
    cards[0].click();
    return 'CLICKED:' + (cards[0].getAttribute('data-side') || '?');
  })()" 2>&1 | tail -1)
  
  echo "Round $i: $result"
  
  if [[ "$result" == "NO_CARDS" ]]; then
    echo "Reached results screen (or another state)"
    break
  fi
done

echo "=== Final state ==="
agent-browser snapshot -i 2>&1 | head -15
