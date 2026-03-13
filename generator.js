const fs = require('fs');

const talks = JSON.parse(fs.readFileSync('data.json', 'utf-8'));

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function generateSchedule() {
  let scheduleHtml = '';
  const startTime = new Date();
  startTime.setHours(10, 0, 0, 0);

  let currentTime = new Date(startTime);

  talks.forEach((talk, index) => {
    const talkEndTime = new Date(currentTime.getTime() + 60 * 60 * 1000);
    scheduleHtml += `
      <div class="talk" data-categories="${talk.categories.join(',').toLowerCase()}">
        <div class="time">${formatTime(currentTime)} - ${formatTime(talkEndTime)}</div>
        <div class="details">
          <h3>${talk.title}</h3>
          <p><strong>Speakers:</strong> ${talk.speakers.join(', ')}</p>
          <p><strong>Categories:</strong> ${talk.categories.join(', ')}</p>
          <p>${talk.description}</p>
        </div>
      </div>
    `;

    currentTime = new Date(talkEndTime.getTime() + 10 * 60 * 1000); // 10-minute break

    // Lunch break after the 3rd talk
    if (index === 2) {
      const lunchEndTime = new Date(currentTime.getTime() + 60 * 60 * 1000);
      scheduleHtml += `
        <div class="talk break">
          <div class="time">${formatTime(currentTime)} - ${formatTime(lunchEndTime)}</div>
          <div class="details">
            <h3>Lunch Break</h3>
          </div>
        </div>
      `;
      currentTime = new Date(lunchEndTime.getTime() + 10 * 60 * 1000);
    }
  });

  return scheduleHtml;
}

const template = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tech Talks 2026</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
    h1, h2, h3 { color: #2c3e50; }
    #schedule { margin-top: 20px; }
    .talk { display: flex; border-bottom: 1px solid #ddd; padding: 20px 0; }
    .talk.hide { display: none; }
    .time { flex: 0 0 150px; font-weight: bold; color: #3498db; }
    .details { flex: 1; }
    .details h3 { margin-top: 0; }
    .break .details h3 { color: #e67e22; }
    #search-bar { width: 100%; padding: 10px; font-size: 16px; border: 1px solid #ccc; border-radius: 5px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <h1>Tech Talks 2026</h1>
  <p>A one-day event showcasing the latest in technology and innovation.</p>

  <h2>Schedule</h2>
  <input type="text" id="search-bar" placeholder="Search by category...">
  <div id="schedule">
    ${generateSchedule()}
  </div>

  <script>
    const searchBar = document.getElementById('search-bar');
    const talks = document.querySelectorAll('.talk:not(.break)');

    searchBar.addEventListener('keyup', (e) => {
      const searchTerm = e.target.value.toLowerCase();

      talks.forEach(talk => {
        const categories = talk.dataset.categories;
        if (categories.includes(searchTerm)) {
          talk.classList.remove('hide');
        } else {
          talk.classList.add('hide');
        }
      });
    });
  </script>
</body>
</html>
`;

fs.writeFileSync('index.html', template);

console.log('Successfully generated index.html');
