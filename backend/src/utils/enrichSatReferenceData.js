import fs from 'fs';
import path from 'path';

const filePath = path.resolve('public/js/sat-math-tools.js');
let content = fs.readFileSync(filePath, 'utf8');

// Define exampleQuestion and exampleSolution for each formula ID
const DEMO_MAP = {
  'circle-area': {
    q: 'A circular flower garden has a diameter of 14 meters. What is the area of the garden in square meters in terms of π?',
    s: 'Radius r = 14 / 2 = 7 m. Area A = πr² = π(7)² = 49π m².'
  },
  'circle-circumference': {
    q: 'The wheel of a bicycle has a radius of 14 inches. How many inches does the bicycle travel in one complete revolution?',
    s: 'Distance in one revolution = Circumference C = 2πr = 2π(14) = 28π inches.'
  },
  'rectangle-area': {
    q: 'A rectangular solar panel has a perimeter of 38 feet and a length of 11 feet. What is the area of the panel in square feet?',
    s: 'P = 2ℓ + 2w => 38 = 2(11) + 2w => 38 = 22 + 2w => 2w = 16 => w = 8 ft. Area A = ℓw = 11 * 8 = 88 ft².'
  },
  'triangle-area': {
    q: 'A right triangle has vertices at (0, 0), (10, 0), and (4, 7). What is the area of the triangle?',
    s: 'Base along x-axis b = 10, perpendicular height h = 7. Area A = ½bh = ½(10)(7) = 35.'
  },
  'box-volume': {
    q: 'A shipping crate is 12 inches long, 8 inches wide, and 6 inches tall. What is its volume in cubic inches?',
    s: 'V = ℓwh = 12 * 8 * 6 = 96 * 6 = 576 in³.'
  },
  'cylinder-volume': {
    q: 'A cylindrical silo has a base radius of 4 meters and a height of 15 meters. What is the volume of the silo in cubic meters?',
    s: 'V = πr²h = π(4)²(15) = π(16)(15) = 240π m³.'
  },
  'sphere-volume': {
    q: 'A spherical gas storage tank has a radius of 6 meters. What is its volume in cubic meters in terms of π?',
    s: 'V = ⁴⁄₃πr³ = ⁴⁄₃π(6)³ = ⁴⁄₃π(216) = 4 * 72π = 288π m³.'
  },
  'cone-volume': {
    q: 'A conical water cup has a height of 9 cm and a top diameter of 8 cm. What is the volume of the cup in cubic centimeters?',
    s: 'Radius r = 8/2 = 4 cm. V = ⅓πr²h = ⅓π(4)²(9) = ⅓π(16)(9) = 16 * 3 * π = 48π cm³.'
  },
  'pyramid-volume': {
    q: 'A pyramid has a rectangular base with length 10 cm, width 6 cm, and height 12 cm. What is its volume?',
    s: 'V = ⅓ℓwh = ⅓(10)(6)(12) = ⅓(720) = 240 cm³.'
  },
  'circle-degrees-radians': {
    q: 'Convert an angle of 210° into radians.',
    s: 'Multiply by π / 180°: 210° * (π / 180°) = 210π / 180 = 7π / 6 radians.'
  },
  'arc-length': {
    q: 'In a circle with radius 12 inches, central angle θ = π/3 radians intercepts an arc. What is the length of the arc?',
    s: 's = rθ = 12 * (π/3) = 4π inches.'
  },
  'sector-area': {
    q: 'A circular pizza has a radius of 9 inches. A slice has a central angle of 40°. What is the area of the slice?',
    s: 'A = (θ / 360°) * πr² = (40 / 360) * π(9)² = (1/9) * 81π = 9π in².'
  },
  'circle-standard-equation': {
    q: 'What is the center and radius of the circle with equation (x - 5)² + (y + 2)² = 81?',
    s: 'In standard form (x - h)² + (y - k)² = r²: Center = (5, -2) and radius r = √81 = 9.'
  },
  'pythagorean-theorem': {
    q: 'A 13-foot ladder is placed against a vertical wall with the foot of the ladder 5 feet away from the base. How high does the ladder reach?',
    s: 'a² + b² = c² => 5² + h² = 13² => 25 + h² = 169 => h² = 144 => h = 12 feet.'
  },
  'pythagorean-triples': {
    q: 'A right triangle has legs of length 24 and 32. What is the length of its hypotenuse?',
    s: 'Divide both by 8: 24/8 = 3, 32/8 = 4. This is an 8x multiple of the 3-4-5 triple! Hypotenuse = 8 * 5 = 40.'
  },
  'triangle-30-60-90': {
    q: 'In a 30°-60°-90° triangle, the side opposite the 30° angle is 7. What is the length of the hypotenuse and the side opposite 60°?',
    s: 'Hypotenuse = 2x = 2(7) = 14. Side opposite 60° = x√3 = 7√3.'
  },
  'triangle-45-45-90': {
    q: 'A square has an area of 50 cm². What is the length of its diagonal?',
    s: 'Side length s = √50 = 5√2 cm. Diagonal = s√2 = (5√2)(√2) = 5 * 2 = 10 cm.'
  },
  'triangle-angle-sum': {
    q: 'In triangle PQR, angle P = 35° and angle Q = 85°. What is the measure of angle R?',
    s: 'Sum of angles is 180°: ∠R = 180° - (35° + 85°) = 180° - 120° = 60°.'
  },
  'slope-formula': {
    q: 'Find the slope of the line passing through (-3, 4) and (2, -6).',
    s: 'm = (y₂ - y₁) / (x₂ - x₁) = (-6 - 4) / (2 - (-3)) = -10 / 5 = -2.'
  },
  'slope-intercept-form': {
    q: 'Convert 3x - 4y = 12 into slope-intercept form and identify the slope and y-intercept.',
    s: '-4y = -3x + 12 => y = (3/4)x - 3. Slope m = 3/4, y-intercept is (0, -3).'
  },
  'point-slope-form': {
    q: 'Write the equation of the line with slope -2 passing through (3, 5).',
    s: 'y - y₁ = m(x - x₁) => y - 5 = -2(x - 3) => y = -2x + 6 + 5 => y = -2x + 11.'
  },
  'midpoint-formula': {
    q: 'Find the midpoint between points A(4, -7) and B(-2, 5).',
    s: 'M = ((4 + (-2))/2, (-7 + 5)/2) = (2/2, -2/2) = (1, -1).'
  },
  'distance-formula': {
    q: 'What is the distance between points (2, 3) and (8, 11)?',
    s: 'd = √((8 - 2)² + (11 - 3)²) = √(6² + 8²) = √(36 + 64) = √100 = 10.'
  },
  'parallel-perpendicular-slopes': {
    q: 'Line L has equation y = (2/5)x + 3. What is the slope of a line perpendicular to line L?',
    s: 'Perpendicular slope is negative reciprocal of 2/5: m_perp = -5/2.'
  },
  'exponent-product-rule': {
    q: 'Simplify (2x³)(5x⁴).',
    s: 'Multiply coefficients: 2 * 5 = 10. Add exponents: x³ * x⁴ = x³⁺⁴ = x⁷. Result = 10x⁷.'
  },
  'exponent-quotient-rule': {
    q: 'Simplify (18x⁷y³) / (6x²y⁵).',
    s: '18/6 = 3. For x: 7 - 2 = 5 (x⁵). For y: 3 - 5 = -2 (1/y²). Result = 3x⁵ / y².'
  },
  'exponent-power-rule': {
    q: 'Simplify (3x⁴)³.',
    s: 'Raise coefficient to power: 3³ = 27. Multiply exponents: (x⁴)³ = x⁴*³ = x¹². Result = 27x¹².'
  },
  'exponent-negative-fractional': {
    q: 'Evaluate 16^(-3/4).',
    s: '16^(-3/4) = 1 / (16^(3/4)) = 1 / (⁴√16)³ = 1 / (2)³ = 1/8.'
  },
  'quadratic-formula': {
    q: 'Find the solutions of x² - 6x + 4 = 0 using the quadratic formula.',
    s: 'x = (6 ± √((-6)² - 4(1)(4))) / 2 = (6 ± √(36 - 16)) / 2 = (6 ± √20) / 2 = (6 ± 2√5)/2 = 3 ± √5.'
  },
  'parabola-vertex': {
    q: 'Find the coordinates of the vertex of the parabola f(x) = 2x² - 8x + 11.',
    s: 'x_vertex = -b/(2a) = -(-8)/(2*2) = 8/4 = 2. f(2) = 2(2)² - 8(2) + 11 = 8 - 16 + 11 = 3. Vertex is (2, 3).'
  },
  'discriminant': {
    q: 'Determine the number of real solutions for 3x² + 5x + 4 = 0.',
    s: 'D = b² - 4ac = 5² - 4(3)(4) = 25 - 48 = -23. Since D < 0, there are zero real solutions (two complex solutions).'
  },
  'sum-product-roots': {
    q: 'Without solving, find the sum and product of the roots of 4x² - 12x - 7 = 0.',
    s: 'Sum = -b/a = -(-12)/4 = 3. Product = c/a = -7/4.'
  },
  'mean-formula': {
    q: 'Five quiz scores are 78, 84, 88, 90, and 95. What is the mean score?',
    s: 'Sum = 78 + 84 + 88 + 90 + 95 = 435. Mean = 435 / 5 = 87.'
  },
  'median-range': {
    q: 'Find the median and range of {14, 8, 22, 16, 11, 25, 18}.',
    s: 'Order data: {8, 11, 14, 16, 18, 22, 25}. Median (middle) = 16. Range = Max - Min = 25 - 8 = 17.'
  },
  'standard-deviation-concept': {
    q: 'Set A = {20, 20, 20, 20} and Set B = {10, 15, 25, 30}. Which set has a higher standard deviation?',
    s: 'Set A has all identical values, so its standard deviation is 0. Set B values are spread out, so Set B has a much higher standard deviation.'
  },
  'probability-basic': {
    q: 'A box contains 6 red, 4 blue, and 10 white balls. A ball is drawn at random. What is the probability that it is red or blue?',
    s: 'Total = 6 + 4 + 10 = 20. Favorable = 6 + 4 = 10. P = 10 / 20 = 1/2 = 0.50 (50%).'
  },
  'probability-independent': {
    q: 'A fair coin is flipped and a standard 6-sided die is rolled. What is the probability of getting Heads and rolling a 5?',
    s: 'Events are independent: P(Heads and 5) = P(Heads) * P(5) = (1/2) * (1/6) = 1/12.'
  },
  'trig-definitions': {
    q: 'In right triangle ABC, angle C is 90°, AB = 15, and BC = 9. What is tan(A)?',
    s: 'Hypotenuse = 15, opposite leg to A is BC = 9. Adjacent leg AC = √(15² - 9²) = √(225 - 81) = √144 = 12. tan(A) = Opp / Adj = 9 / 12 = 3/4 = 0.75.'
  },
  'complementary-angles': {
    q: 'If cos(4x - 6)° = sin(3x + 12)°, what is the value of x?',
    s: 'Complementary angles add to 90°: (4x - 6) + (3x + 12) = 90 => 7x + 6 = 90 => 7x = 84 => x = 12.'
  },
  'polygon-angles': {
    q: 'What is the measure of each interior angle in a regular pentagon (5 sides)?',
    s: 'Total interior sum = (5 - 2) * 180° = 3 * 180° = 540°. Each interior angle in regular pentagon = 540° / 5 = 108°.'
  }
};

// Inject exampleQuestion and exampleSolution into each formula in SAT_FORMULAS_DATA
for (const [id, demo] of Object.entries(DEMO_MAP)) {
  const targetRegex = new RegExp(`(id:\\s*['"]${id}['"][\\s\\S]*?description:\\s*['"][^'"]*['"],)`);
  if (targetRegex.test(content)) {
    content = content.replace(targetRegex, `$1\n          exampleQuestion: '${demo.q.replace(/'/g, "\\'")}',\n          exampleSolution: '${demo.s.replace(/'/g, "\\'")}',`);
  }
}

// Update the formula card HTML to render the demo problem
const cardHtmlTarget = `<div class="sat-formula-math">\${f.math}</div>
                    <div class="sat-formula-desc">\${f.description}</div>
                  </div>`;

const cardHtmlReplacement = `<div class="sat-formula-math">\${f.math}</div>
                    <div class="sat-formula-desc">\${f.description}</div>
                    \${f.exampleQuestion ? \`
                      <details class="sat-formula-demo">
                        <summary class="sat-demo-summary">💡 Demo Problem & Solution</summary>
                        <div class="sat-demo-body">
                          <div class="sat-demo-question"><strong>Example:</strong> \${escapeHtml(f.exampleQuestion)}</div>
                          <div class="sat-demo-solution"><strong>Step-by-step:</strong> \${escapeHtml(f.exampleSolution)}</div>
                        </div>
                      </details>
                    \` : ''}
                  </div>`;

if (content.includes(cardHtmlTarget)) {
  content = content.replace(cardHtmlTarget, cardHtmlReplacement);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully enriched sat-math-tools.js with 40 demo questions and step-by-step solutions!');
