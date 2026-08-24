const http = require('http');
http.get('http://localhost:3000/api/admin/videos', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
        const json = JSON.parse(data);
        json.forEach(v => console.log(`${v.title} - Premium: ${v.isPremium} - PackageId: ${v.packageId}`));
    } catch(e) { console.log(data.substring(0, 100)); }
  });
});
