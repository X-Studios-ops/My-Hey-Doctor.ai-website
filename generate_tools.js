const fs = require('fs');
const path = require('path');

const tools = [
  {
    id: "water-intake-calculator",
    title: "Advanced Water Intake Calculator",
    desc: "Calculate recommended daily water intake based on your weight, activity level, and climate.",
    inputs: `
      <input type="number" id="weight" class="tool-input" placeholder="Weight (kg)">
      <select id="activity" class="tool-input">
        <option value="1">Low Activity</option>
        <option value="1.2">Moderate Activity</option>
        <option value="1.5">High Activity</option>
      </select>
      <select id="climate" class="tool-input">
        <option value="1">Moderate Climate</option>
        <option value="1.2">Hot Climate</option>
      </select>
    `,
    logic: `
      const weight = parseFloat(document.getElementById('weight').value);
      const activity = parseFloat(document.getElementById('activity').value);
      const climate = parseFloat(document.getElementById('climate').value);
      const resultBox = document.getElementById('result');
      if(!weight || weight <= 0) {
        resultBox.style.display = 'block';
        resultBox.style.borderLeftColor = '#ff4d4d';
        resultBox.innerHTML = '⚠️ Please enter a valid weight.';
        return;
      }
      const baseWater = weight * 35; // ml
      const totalWater = (baseWater * activity * climate) / 1000;
      resultBox.style.display = 'block';
      resultBox.style.borderLeftColor = '#1ebd74';
      resultBox.innerHTML = 'Recommended Intake: <strong>' + totalWater.toFixed(2) + ' Liters/Day</strong><br><small style="color:var(--text-muted)">This is an estimate, not medical advice.</small>';
    `
  },
  {
    id: "calorie-calculator",
    title: "Calorie Needs Calculator",
    desc: "Estimate daily calorie needs using age, sex, height, weight, and activity level.",
    inputs: `
      <select id="sex" class="tool-input">
        <option value="m">Male</option>
        <option value="f">Female</option>
      </select>
      <input type="number" id="age" class="tool-input" placeholder="Age (years)">
      <input type="number" id="weight" class="tool-input" placeholder="Weight (kg)">
      <input type="number" id="height" class="tool-input" placeholder="Height (cm)">
      <select id="activity" class="tool-input">
        <option value="1.2">Sedentary (little or no exercise)</option>
        <option value="1.375">Lightly active (light exercise 1-3 days/week)</option>
        <option value="1.55">Moderately active (moderate exercise 3-5 days/week)</option>
        <option value="1.725">Very active (hard exercise 6-7 days/week)</option>
      </select>
    `,
    logic: `
      const sex = document.getElementById('sex').value;
      const age = parseFloat(document.getElementById('age').value);
      const weight = parseFloat(document.getElementById('weight').value);
      const height = parseFloat(document.getElementById('height').value);
      const activity = parseFloat(document.getElementById('activity').value);
      const resultBox = document.getElementById('result');
      
      if(!age || !weight || !height) {
        resultBox.style.display = 'block';
        resultBox.style.borderLeftColor = '#ff4d4d';
        resultBox.innerHTML = '⚠️ Please fill all fields correctly.';
        return;
      }
      
      let bmr;
      if(sex === 'm') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
      }
      const calories = bmr * activity;
      
      resultBox.style.display = 'block';
      resultBox.style.borderLeftColor = '#1ebd74';
      resultBox.innerHTML = 'BMR: <strong>' + Math.round(bmr) + ' kcal</strong><br>Estimated Daily Needs: <strong>' + Math.round(calories) + ' kcal</strong><br><small style="color:var(--text-muted)">These results are estimates.</small>';
    `
  },
  {
    id: "ideal-weight-calculator",
    title: "Ideal Weight Calculator",
    desc: "Calculate an estimated healthy weight range using your height.",
    inputs: `
      <select id="sex" class="tool-input">
        <option value="m">Male</option>
        <option value="f">Female</option>
      </select>
      <input type="number" id="height" class="tool-input" placeholder="Height (cm)">
    `,
    logic: `
      const sex = document.getElementById('sex').value;
      const height = parseFloat(document.getElementById('height').value);
      const resultBox = document.getElementById('result');
      
      if(!height || height <= 100) {
        resultBox.style.display = 'block';
        resultBox.style.borderLeftColor = '#ff4d4d';
        resultBox.innerHTML = '⚠️ Please enter a valid height (cm).';
        return;
      }
      
      const heightInches = height / 2.54;
      const baseHeight = 60; // 5 feet
      let ideal;
      
      if (heightInches <= baseHeight) {
        ideal = sex === 'm' ? 50 : 45.5;
      } else {
        ideal = (sex === 'm' ? 50 : 45.5) + 2.3 * (heightInches - baseHeight);
      }
      
      const minWeight = 18.5 * Math.pow(height/100, 2);
      const maxWeight = 24.9 * Math.pow(height/100, 2);
      
      resultBox.style.display = 'block';
      resultBox.style.borderLeftColor = '#1ebd74';
      resultBox.innerHTML = 'Estimated Ideal Weight (Devine Formula): <strong>' + ideal.toFixed(1) + ' kg</strong><br>Healthy BMI Range: <strong>' + minWeight.toFixed(1) + ' - ' + maxWeight.toFixed(1) + ' kg</strong><br><small style="color:var(--text-muted)">"Ideal weight" is only an estimate and varies by body composition.</small>';
    `
  },
  {
    id: "sleep-calculator",
    title: "Sleep Calculator",
    desc: "Find sleep-cycle-friendly times based on when you want to wake up or go to bed.",
    inputs: `
      <select id="mode" class="tool-input" onchange="document.getElementById('timeLabel').innerText = this.value === 'wake' ? 'I want to wake up at:' : 'I want to go to bed at:';">
        <option value="wake">Calculate Bedtime</option>
        <option value="bed">Calculate Wake-up Time</option>
      </select>
      <div id="timeLabel" style="margin-bottom: 5px; font-size: 14px; color: var(--text-muted);">I want to wake up at:</div>
      <input type="time" id="time" class="tool-input">
    `,
    logic: `
      const mode = document.getElementById('mode').value;
      const timeStr = document.getElementById('time').value;
      const resultBox = document.getElementById('result');
      
      if(!timeStr) {
        resultBox.style.display = 'block';
        resultBox.style.borderLeftColor = '#ff4d4d';
        resultBox.innerHTML = '⚠️ Please enter a time.';
        return;
      }
      
      const parts = timeStr.split(':');
      const hours = parseInt(parts[0]);
      const minutes = parseInt(parts[1]);
      const baseDate = new Date();
      baseDate.setHours(hours, minutes, 0, 0);
      
      let times = [];
      // A sleep cycle is 90 mins. Average sleep is 4-6 cycles. Plus 15 mins to fall asleep.
      if (mode === 'wake') {
        for(let i=6; i>=3; i--) {
          const t = new Date(baseDate.getTime() - (i * 90 + 15) * 60000);
          times.push(t.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + ' (' + i + ' cycles)');
        }
      } else {
        for(let i=3; i<=6; i++) {
          const t = new Date(baseDate.getTime() + (i * 90 + 15) * 60000);
          times.push(t.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + ' (' + i + ' cycles)');
        }
      }
      
      resultBox.style.display = 'block';
      resultBox.style.borderLeftColor = '#1ebd74';
      resultBox.innerHTML = '<strong>Recommended times:</strong><br>' + times.join('<br>') + '<br><br><small style="color:var(--text-muted)">Recommended adult sleep duration is 7-9 hours (about 5-6 cycles).</small>';
    `
  },
  {
    id: "heart-rate-zone-calculator",
    title: "Heart Rate Zone Calculator",
    desc: "Calculate your estimated maximum heart rate and training zones.",
    inputs: `
      <input type="number" id="age" class="tool-input" placeholder="Age (years)">
    `,
    logic: `
      const age = parseInt(document.getElementById('age').value);
      const resultBox = document.getElementById('result');
      
      if(!age || age <= 0) {
        resultBox.style.display = 'block';
        resultBox.style.borderLeftColor = '#ff4d4d';
        resultBox.innerHTML = '⚠️ Please enter a valid age.';
        return;
      }
      
      const maxHr = 220 - age;
      
      resultBox.style.display = 'block';
      resultBox.style.borderLeftColor = '#1ebd74';
      resultBox.innerHTML = 'Estimated Max Heart Rate: <strong>' + maxHr + ' bpm</strong><br><br>' +
        '<strong>Training Zones:</strong><br>' +
        'Zone 1 (50-60%): ' + Math.round(maxHr * 0.5) + ' - ' + Math.round(maxHr * 0.6) + ' bpm<br>' +
        'Zone 2 (60-70%): ' + Math.round(maxHr * 0.6) + ' - ' + Math.round(maxHr * 0.7) + ' bpm<br>' +
        'Zone 3 (70-80%): ' + Math.round(maxHr * 0.7) + ' - ' + Math.round(maxHr * 0.8) + ' bpm<br>' +
        'Zone 4 (80-90%): ' + Math.round(maxHr * 0.8) + ' - ' + Math.round(maxHr * 0.9) + ' bpm<br>' +
        'Zone 5 (90-100%): ' + Math.round(maxHr * 0.9) + ' - ' + maxHr + ' bpm<br>' +
        '<br><small style="color:var(--text-muted)">Formulas provide estimates and may vary by individual fitness levels.</small>';
    `
  },
  {
    id: "body-fat-calculator",
    title: "Body Fat Percentage Estimator",
    desc: "Estimate your body fat percentage using the US Navy method.",
    inputs: `
      <select id="sex" class="tool-input" onchange="document.getElementById('hipGroup').style.display = this.value === 'f' ? 'block' : 'none';">
        <option value="m">Male</option>
        <option value="f">Female</option>
      </select>
      <input type="number" id="height" class="tool-input" placeholder="Height (cm)">
      <input type="number" id="neck" class="tool-input" placeholder="Neck circumference (cm)">
      <input type="number" id="waist" class="tool-input" placeholder="Waist circumference (cm)">
      <div id="hipGroup" style="display:none;">
        <input type="number" id="hip" class="tool-input" placeholder="Hip circumference (cm)">
      </div>
    `,
    logic: `
      const sex = document.getElementById('sex').value;
      const height = parseFloat(document.getElementById('height').value);
      const neck = parseFloat(document.getElementById('neck').value);
      const waist = parseFloat(document.getElementById('waist').value);
      const hip = parseFloat(document.getElementById('hip').value);
      const resultBox = document.getElementById('result');
      
      if(!height || !neck || !waist || (sex === 'f' && !hip)) {
        resultBox.style.display = 'block';
        resultBox.style.borderLeftColor = '#ff4d4d';
        resultBox.innerHTML = '⚠️ Please fill all required measurements correctly.';
        return;
      }
      
      let bf;
      if (sex === 'm') {
        bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
      } else {
        bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
      }
      
      resultBox.style.display = 'block';
      resultBox.style.borderLeftColor = '#1ebd74';
      resultBox.innerHTML = 'Estimated Body Fat: <strong>' + bf.toFixed(1) + '%</strong><br><small style="color:var(--text-muted)">This is an estimation. Clinically measured values (like DEXA scans) are more accurate.</small>';
    `
  },
  {
    id: "macro-calculator",
    title: "Macro Calculator",
    desc: "Estimate daily protein, carbohydrate, and fat targets based on your calorie needs and goals.",
    inputs: `
      <input type="number" id="calories" class="tool-input" placeholder="Daily Calorie Target (kcal)">
      <select id="goal" class="tool-input">
        <option value="maintenance">Maintenance (Balanced 30/35/35)</option>
        <option value="loss">Weight Loss (High Protein 40/40/20)</option>
        <option value="gain">Muscle Gain (High Carb 30/50/20)</option>
      </select>
    `,
    logic: `
      const calories = parseFloat(document.getElementById('calories').value);
      const goal = document.getElementById('goal').value;
      const resultBox = document.getElementById('result');
      
      if(!calories || calories <= 0) {
        resultBox.style.display = 'block';
        resultBox.style.borderLeftColor = '#ff4d4d';
        resultBox.innerHTML = '⚠️ Please enter a valid calorie target.';
        return;
      }
      
      let pPct, cPct, fPct;
      if(goal === 'maintenance') { pPct=0.30; cPct=0.35; fPct=0.35; }
      else if(goal === 'loss') { pPct=0.40; cPct=0.40; fPct=0.20; }
      else if(goal === 'gain') { pPct=0.30; cPct=0.50; fPct=0.20; }
      
      const protein = (calories * pPct) / 4; // 4 kcal/g
      const carbs = (calories * cPct) / 4;   // 4 kcal/g
      const fat = (calories * fPct) / 9;     // 9 kcal/g
      
      resultBox.style.display = 'block';
      resultBox.style.borderLeftColor = '#1ebd74';
      resultBox.innerHTML = '<strong>Daily Macros:</strong><br>' +
        'Protein (' + (pPct*100) + '%): <strong>' + Math.round(protein) + 'g</strong><br>' +
        'Carbs (' + (cPct*100) + '%): <strong>' + Math.round(carbs) + 'g</strong><br>' +
        'Fat (' + (fPct*100) + '%): <strong>' + Math.round(fat) + 'g</strong>';
    `
  },
  {
    id: "pregnancy-due-date-calculator",
    title: "Pregnancy Due Date Calculator",
    desc: "Calculate estimated due date from Last Menstrual Period (LMP).",
    inputs: `
      <label style="display:block;margin-bottom:5px;font-size:14px;color:var(--text-muted)">First day of Last Menstrual Period:</label>
      <input type="date" id="lmp" class="tool-input">
    `,
    logic: `
      const lmpStr = document.getElementById('lmp').value;
      const resultBox = document.getElementById('result');
      
      if(!lmpStr) {
        resultBox.style.display = 'block';
        resultBox.style.borderLeftColor = '#ff4d4d';
        resultBox.innerHTML = '⚠️ Please select a date.';
        return;
      }
      
      const lmp = new Date(lmpStr);
      // Naegele's rule: add 7 days, subtract 3 months, add 1 year = add 280 days
      const due = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
      
      resultBox.style.display = 'block';
      resultBox.style.borderLeftColor = '#1ebd74';
      resultBox.innerHTML = 'Estimated Due Date: <strong>' + due.toLocaleDateString() + '</strong><br><br><small style="color:var(--text-muted)">Disclaimer: This is an estimate based on a standard 28-day cycle and is not a substitute for professional medical care.</small>';
    `
  },
  {
    id: "blood-pressure-checker",
    title: "Blood Pressure Category Guide",
    desc: "Check the general category for your blood pressure reading.",
    inputs: `
      <input type="number" id="sys" class="tool-input" placeholder="Systolic (upper number)">
      <input type="number" id="dia" class="tool-input" placeholder="Diastolic (lower number)">
    `,
    logic: `
      const sys = parseInt(document.getElementById('sys').value);
      const dia = parseInt(document.getElementById('dia').value);
      const resultBox = document.getElementById('result');
      
      if(!sys || !dia) {
        resultBox.style.display = 'block';
        resultBox.style.borderLeftColor = '#ff4d4d';
        resultBox.innerHTML = '⚠️ Please enter both values.';
        return;
      }
      
      let cat = '';
      let color = '#1ebd74';
      let warning = '';
      
      if (sys > 180 || dia > 120) {
        cat = 'Hypertensive Crisis';
        color = '#ff4d4d';
        warning = '<br><strong style="color:#ff4d4d">🚨 URGENT: Seek emergency medical attention immediately.</strong>';
      } else if (sys >= 140 || dia >= 90) {
        cat = 'High Blood Pressure (Stage 2)';
        color = '#ff9900';
      } else if (sys >= 130 || dia >= 80) {
        cat = 'High Blood Pressure (Stage 1)';
        color = '#f6ad55';
      } else if (sys >= 120 && dia < 80) {
        cat = 'Elevated';
        color = '#f6ad55';
      } else if (sys < 120 && dia < 80) {
        cat = 'Normal';
      } else {
        cat = 'Mixed/Check with doctor';
        color = '#a0aec0';
      }
      
      resultBox.style.display = 'block';
      resultBox.style.borderLeftColor = color;
      resultBox.innerHTML = 'Category: <strong style="color:' + color + '">' + cat + '</strong>' + warning + '<br><br><small style="color:var(--text-muted)">Note: We DO NOT diagnose conditions. Please consult a healthcare provider.</small>';
    `
  },
  {
    id: "bmi-calculator",
    title: "BMI & Health Interpretation Tool",
    desc: "Advanced Body Mass Index interpretation, including limitations and age-related considerations.",
    inputs: `
      <input type="number" id="weight" class="tool-input" placeholder="Weight in kg (e.g., 70)">
      <input type="number" id="height" class="tool-input" placeholder="Height in cm (e.g., 175)">
      <input type="number" id="age" class="tool-input" placeholder="Age (years)">
    `,
    logic: `
      const weight = parseFloat(document.getElementById('weight').value);
      const heightCm = parseFloat(document.getElementById('height').value);
      const age = parseInt(document.getElementById('age').value);
      const resultBox = document.getElementById('result');
      
      if(!weight || !heightCm || !age) {
        resultBox.style.display = 'block';
        resultBox.style.borderLeftColor = '#ff4d4d';
        resultBox.innerHTML = '⚠️ Please fill all fields.';
        return;
      }
      
      const bmi = (weight / Math.pow(heightCm/100, 2)).toFixed(1);
      let cat = '';
      let color = '';
      if (bmi < 18.5) { cat = 'Underweight'; color = '#f6ad55'; }
      else if (bmi < 25) { cat = 'Normal Weight'; color = '#1ebd74'; }
      else if (bmi < 30) { cat = 'Overweight'; color = '#f6ad55'; }
      else { cat = 'Obese'; color = '#ff4d4d'; }
      
      let note = "BMI is a simple height-to-weight ratio. It does not distinguish between muscle and fat mass.";
      if (age > 65) {
        note += " For older adults, a slightly higher BMI may offer protective health benefits.";
      }
      
      resultBox.style.display = 'block';
      resultBox.style.borderLeftColor = color;
      resultBox.innerHTML = 'BMI: <strong>' + bmi + '</strong> (<span style="color:' + color + '">' + cat + '</span>)<br><br><strong>Interpretation & Limitations:</strong><br>' + note;
    `
  }
];

const template = (tool) => `<!DOCTYPE html>  
<html lang="en">  
<head>  
    <meta charset="UTF-8">  
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="canonical" href="https://my-hey-doctor-ai-website.vercel.app/tools/${tool.id}" />
    <meta name="description" content="${tool.desc} - Heydoctor.ai">  
    <title>${tool.title} | Heydoctor.ai</title>  
    <link rel="icon" type="image/png" href="../logo.png">  
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap" rel="stylesheet">  
    <style>  
        :root {  
            --bg-color: #0b1510;  
            --card-bg: #12221a;  
            --accent-green: #1ebd74;  
            --text-main: #ffffff;  
            --text-muted: #a0aec0;  
            --gradient-accent: linear-gradient(135deg, #1ebd74, #0f9b58);  
        }  
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Poppins', sans-serif; }  
        body { background-color: var(--bg-color); color: var(--text-main); line-height: 1.6; }  
        
        .navbar { display: flex; justify-content: space-between; align-items: center; padding: 20px 8%; background: rgba(11, 21, 16, 0.8); border-bottom: 1px solid rgba(30, 189, 116, 0.1); }  
        .logo { font-size: 24px; font-weight: 800; letter-spacing: 1px; color: var(--text-main); text-decoration: none; }  
        .logo span { color: var(--accent-green); }  
        
        .container { max-width: 600px; margin: 60px auto; padding: 0 20px; }
        .tool-card { background-color: var(--card-bg); border: 1px solid rgba(30, 189, 116, 0.2); padding: 40px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .tool-card h1 { font-size: 26px; margin-bottom: 10px; color: var(--accent-green); }
        .tool-desc { color: var(--text-muted); font-size: 14px; margin-bottom: 30px; }
        
        .tool-input { width: 100%; padding: 14px 15px; margin-bottom: 20px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: var(--text-main); border-radius: 8px; font-size: 15px; outline: none; transition: border-color 0.3s; }
        .tool-input:focus { border-color: var(--accent-green); }
        
        .tool-btn { background: var(--gradient-accent); color: white; border: none; padding: 14px 20px; border-radius: 8px; font-weight: 600; width: 100%; cursor: pointer; transition: opacity 0.3s, transform 0.2s; font-size: 16px; }
        .tool-btn:hover { opacity: 0.9; transform: translateY(-2px); }
        
        .tool-result { margin-top: 25px; padding: 20px; background: rgba(0, 0, 0, 0.3); border-radius: 8px; font-size: 15px; color: var(--text-main); display: none; border-left: 4px solid var(--accent-green); line-height: 1.8; }
        
        .back-link { display: inline-block; margin-top: 20px; color: var(--accent-green); text-decoration: none; font-size: 14px; }
        .back-link:hover { text-decoration: underline; }
    </style>  
</head>  
<body>  
    <nav class="navbar">
        <a href="/" class="logo">Heydoctor<span>.ai</span></a>
    </nav>
    <div class="container">
        <div class="tool-card">
            <h1>${tool.title}</h1>
            <p class="tool-desc">${tool.desc}</p>
            
            ${tool.inputs}
            
            <button onclick="calculate()" class="tool-btn">Calculate</button>
            <div id="result" class="tool-result"></div>
            
            <a href="/" class="back-link">⬅ Back to Home</a>
        </div>
    </div>
    
    <script>
        function calculate() {
            ${tool.logic}
        }
    </script>
</body>  
</html>`;

if (!fs.existsSync(path.join(__dirname, 'tools'))) {
  fs.mkdirSync(path.join(__dirname, 'tools'));
}

tools.forEach(t => {
  fs.writeFileSync(path.join(__dirname, 'tools', t.id + '.html'), template(t));
});
