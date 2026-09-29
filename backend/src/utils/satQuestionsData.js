/**
 * SATELITE.UZ - Official Digital SAT Question Bank Dataset
 * Authentic College Board Digital SAT Style Questions
 * Domains: Mathematics (Algebra, Advanced Math, Problem Solving, Geometry/Trig)
 *          Reading & Writing (Information & Ideas, Craft & Structure, Expression of Ideas, Conventions)
 */

const SAT_INITIAL_40_QUESTIONS = [
  // ==========================================
  // MATHEMATICS - ALGEBRA (5 Questions)
  // ==========================================
  {
    subjectSlug: 'math',
    topicSlug: 'algebra',
    difficulty: 'EASY',
    questionText: 'If 5(2x - 3) = 35, what is the value of 4x + 7?',
    explanation: 'Divide both sides by 5: 2x - 3 = 7. Add 3 to both sides: 2x = 10, so x = 5. Now substitute x = 5 into the expression 4x + 7: 4(5) + 7 = 20 + 7 = 27.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '17', isCorrect: false },
      { optionLabel: 'B', optionText: '25', isCorrect: false },
      { optionLabel: 'C', optionText: '27', isCorrect: true },
      { optionLabel: 'D', optionText: '32', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'algebra',
    difficulty: 'MEDIUM',
    questionText: 'A rental company charges a flat fee of $45 plus $18 per hour to rent a utility trailer. If a contractor spent $135 in total, which equation can be used to determine the number of hours, h, the trailer was rented?',
    explanation: 'The total cost is the fixed fee ($45) plus the hourly rate ($18) multiplied by the number of hours (h). Setting this equal to the total cost gives: 18h + 45 = 135.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '45h + 18 = 135', isCorrect: false },
      { optionLabel: 'B', optionText: '18h + 45 = 135', isCorrect: true },
      { optionLabel: 'C', optionText: '18h - 45 = 135', isCorrect: false },
      { optionLabel: 'D', optionText: '(18 + 45)h = 135', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'algebra',
    difficulty: 'MEDIUM',
    questionText: 'Consider the system of equations:\n3x - 2y = 8\n6x - 4y = k\nFor which value of k does the system have no solution?',
    explanation: 'Multiply the first equation by 2: 6x - 4y = 16. The left-hand sides of both equations are identical (6x - 4y). If k = 16, there are infinitely many solutions. For the system to have NO solution, the lines must be parallel and distinct, meaning k can be any number EXCEPT 16. Among the choices, if k = 20, the equations represent distinct parallel lines, yielding zero solutions.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: 'k = 16', isCorrect: false },
      { optionLabel: 'B', optionText: 'k = 20', isCorrect: true },
      { optionLabel: 'C', optionText: 'k = 8', isCorrect: false },
      { optionLabel: 'D', optionText: 'k = 0', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'algebra',
    difficulty: 'HARD',
    questionText: 'If |2x - 5| ≤ 9, what is the greatest possible value of 3x + 1?',
    explanation: 'The absolute value inequality |2x - 5| ≤ 9 translates to -9 ≤ 2x - 5 ≤ 9. Add 5 to all parts: -4 ≤ 2x ≤ 14. Divide by 2: -2 ≤ x ≤ 7. The maximum value of x is 7. Substituting x = 7 into 3x + 1 yields 3(7) + 1 = 21 + 1 = 22.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '16', isCorrect: false },
      { optionLabel: 'B', optionText: '20', isCorrect: false },
      { optionLabel: 'C', optionText: '22', isCorrect: true },
      { optionLabel: 'D', optionText: '28', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'algebra',
    difficulty: 'MEDIUM',
    questionText: 'Line L in the xy-plane is perpendicular to the line with equation y = -(2/3)x + 5 and passes through the point (4, 1). What is the equation of line L in slope-intercept form?',
    explanation: 'The slope of a perpendicular line is the negative reciprocal of the given slope. The given slope is -2/3, so the perpendicular slope is m = 3/2. Using point-slope form: y - 1 = (3/2)(x - 4) => y = (3/2)x - 6 + 1 => y = (3/2)x - 5.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: 'y = (3/2)x - 5', isCorrect: true },
      { optionLabel: 'B', optionText: 'y = -(3/2)x + 7', isCorrect: false },
      { optionLabel: 'C', optionText: 'y = (2/3)x - 1', isCorrect: false },
      { optionLabel: 'D', optionText: 'y = (3/2)x + 1', isCorrect: false }
    ]
  },

  // ==========================================
  // MATHEMATICS - ADVANCED MATH (5 Questions)
  // ==========================================
  {
    subjectSlug: 'math',
    topicSlug: 'advanced-math',
    difficulty: 'EASY',
    questionText: 'What are the solutions to the quadratic equation x^2 - 7x + 10 = 0?',
    explanation: 'Factor the quadratic: (x - 2)(x - 5) = 0. Setting each factor to zero gives x = 2 and x = 5.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: 'x = -2 and x = -5', isCorrect: false },
      { optionLabel: 'B', optionText: 'x = 2 and x = 5', isCorrect: true },
      { optionLabel: 'C', optionText: 'x = -1 and x = 10', isCorrect: false },
      { optionLabel: 'D', optionText: 'x = 1 and x = -10', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'advanced-math',
    difficulty: 'MEDIUM',
    questionText: 'The function g is defined by g(x) = 2(x - 3)^2 - 8. What is the y-coordinate of the vertex of the graph of g in the xy-plane?',
    explanation: 'A quadratic in vertex form is written as y = a(x - h)^2 + k, where the vertex is located at (h, k). Here, h = 3 and k = -8. Thus, the y-coordinate of the vertex is -8.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '3', isCorrect: false },
      { optionLabel: 'B', optionText: '-3', isCorrect: false },
      { optionLabel: 'C', optionText: '-8', isCorrect: true },
      { optionLabel: 'D', optionText: '10', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'advanced-math',
    difficulty: 'MEDIUM',
    questionText: 'For the quadratic equation 3x^2 - 6x + c = 0, what value of c will result in exactly one real solution?',
    explanation: 'A quadratic ax^2 + bx + c = 0 has exactly one real solution when its discriminant b^2 - 4ac = 0. Here a = 3 and b = -6. So: (-6)^2 - 4(3)(c) = 0 => 36 - 12c = 0 => 12c = 36 => c = 3.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '2', isCorrect: false },
      { optionLabel: 'B', optionText: '3', isCorrect: true },
      { optionLabel: 'C', optionText: '6', isCorrect: false },
      { optionLabel: 'D', optionText: '12', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'advanced-math',
    difficulty: 'HARD',
    questionText: 'An initial bacterial population of 400 triples every 6 hours. Which equation models the population, P, after t hours?',
    explanation: 'The standard exponential growth model is P(t) = P0 * (growth factor)^(t / period). Here initial population P0 = 400, the growth factor is 3, and the doubling/tripling period is 6 hours. Therefore, P(t) = 400 * (3)^(t/6).',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: 'P(t) = 400(3)^(6t)', isCorrect: false },
      { optionLabel: 'B', optionText: 'P(t) = 400(3)^(t/6)', isCorrect: true },
      { optionLabel: 'C', optionText: 'P(t) = 400(6)^(t/3)', isCorrect: false },
      { optionLabel: 'D', optionText: 'P(t) = 1200^(t/6)', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'advanced-math',
    difficulty: 'HARD',
    questionText: 'Which expression is equivalent to (x^(3/2) * y^(-1/2)) / (x^(-1/2) * y^(3/2)) for all positive values of x and y?',
    explanation: 'Using exponent rules: for x, subtract exponents: (3/2) - (-1/2) = (3/2) + (1/2) = 4/2 = 2, so x^2. For y, subtract exponents: (-1/2) - (3/2) = -4/2 = -2, so y^(-2) = 1/y^2. The expression simplifies to x^2 / y^2.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: 'x^2 / y^2', isCorrect: true },
      { optionLabel: 'B', optionText: 'x / y', isCorrect: false },
      { optionLabel: 'C', optionText: 'x^2 * y^2', isCorrect: false },
      { optionLabel: 'D', optionText: 'x^(1/2) / y^(1/2)', isCorrect: false }
    ]
  },

  // ==========================================
  // MATHEMATICS - PROBLEM SOLVING & DATA ANALYSIS (5 Questions)
  // ==========================================
  {
    subjectSlug: 'math',
    topicSlug: 'problem-solving',
    difficulty: 'EASY',
    questionText: 'A laboratory technician mixes 300 milliliters of a 15% saline solution with 200 milliliters of a 25% saline solution. What is the saline concentration of the resulting mixture?',
    explanation: 'Calculate the total amount of saline: 300 * 0.15 = 45 mL; 200 * 0.25 = 50 mL. Total saline = 45 + 50 = 95 mL. Total liquid volume = 300 + 200 = 500 mL. Concentration = 95 / 500 = 0.19 = 19%.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '18%', isCorrect: false },
      { optionLabel: 'B', optionText: '19%', isCorrect: true },
      { optionLabel: 'C', optionText: '20%', isCorrect: false },
      { optionLabel: 'D', optionText: '22%', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'problem-solving',
    difficulty: 'MEDIUM',
    questionText: 'In a survey of 250 university students, 140 reported studying STEM majors, 80 reported participating in collegiate athletics, and 45 reported doing both. If a student is selected at random from the survey, what is the probability that the student is NOT in a STEM major and does NOT participate in athletics?',
    explanation: 'By the principle of inclusion-exclusion, the number of students who do STEM OR athletics is: 140 + 80 - 45 = 175. Students doing neither = 250 - 175 = 75. The probability is 75 / 250 = 3 / 10 = 0.30 (30%).',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '0.25', isCorrect: false },
      { optionLabel: 'B', optionText: '0.30', isCorrect: true },
      { optionLabel: 'C', optionText: '0.35', isCorrect: false },
      { optionLabel: 'D', optionText: '0.40', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'problem-solving',
    difficulty: 'MEDIUM',
    questionText: 'A car travels 180 miles at an average speed of 60 miles per hour and returns along the same route at an average speed of 45 miles per hour. What was the average speed, in miles per hour, for the entire round trip?',
    explanation: 'Total distance = 180 + 180 = 360 miles. Outbound time = 180 / 60 = 3 hours. Return time = 180 / 45 = 4 hours. Total time = 3 + 4 = 7 hours. Average speed = total distance / total time = 360 / 7 ≈ 51.4 miles per hour.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '50.0 mph', isCorrect: false },
      { optionLabel: 'B', optionText: '51.4 mph', isCorrect: true },
      { optionLabel: 'C', optionText: '52.5 mph', isCorrect: false },
      { optionLabel: 'D', optionText: '55.0 mph', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'problem-solving',
    difficulty: 'HARD',
    questionText: 'A political polling institute conducts a randomized survey of 1,200 voters, finding that 54% support a proposed environmental initiative with a margin of error of ±3% at a 95% confidence level. Which conclusion is most appropriately supported by the poll?',
    explanation: 'A margin of error of ±3% around 54% establishes a plausible confidence interval from 51% to 57%. Since the entire interval is greater than 50%, it is plausible that a majority (more than 50%) of all voters in the population support the initiative.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: 'Exactly 54% of all registered voters will vote in favor of the initiative.', isCorrect: false },
      { optionLabel: 'B', optionText: 'It is plausible that between 51% and 57% of all voters in the population support the initiative.', isCorrect: true },
      { optionLabel: 'C', optionText: 'Increasing the sample size to 2,400 voters will definitely double the support percentage.', isCorrect: false },
      { optionLabel: 'D', optionText: 'The poll proves that non-voters hold opposing views to surveyed voters.', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'problem-solving',
    difficulty: 'MEDIUM',
    questionText: 'Data set A consists of seven values: {4, 7, 7, 9, 12, 14, 17}. If the value 25 is appended to data set A to create data set B, which statistical measure will experience the greatest increase?',
    explanation: 'In data set A, the median is 9. In data set B (8 values), the median is (9 + 12)/2 = 10.5 (increases by 1.5). The mean of set A is 70/7 = 10; for set B it is (70+25)/8 = 95/8 = 11.875 (increases by 1.875). The range of set A is 17 - 4 = 13. The range of set B is 25 - 4 = 21 (increases by 8). Therefore, the range experiences by far the largest increase.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: 'The mean', isCorrect: false },
      { optionLabel: 'B', optionText: 'The median', isCorrect: false },
      { optionLabel: 'C', optionText: 'The mode', isCorrect: false },
      { optionLabel: 'D', optionText: 'The range', isCorrect: true }
    ]
  },

  // ==========================================
  // MATHEMATICS - GEOMETRY & TRIGONOMETRY (5 Questions)
  // ==========================================
  {
    subjectSlug: 'math',
    topicSlug: 'geometry',
    difficulty: 'EASY',
    questionText: 'A right circular cylinder has a radius of 4 centimeters and a height of 10 centimeters. What is the volume of the cylinder, in cubic centimeters? (Formula: V = π * r^2 * h)',
    explanation: 'Using the volume formula for a cylinder: V = π * (4)^2 * 10 = π * 16 * 10 = 160π cubic centimeters.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '80π', isCorrect: false },
      { optionLabel: 'B', optionText: '160π', isCorrect: true },
      { optionLabel: 'C', optionText: '320π', isCorrect: false },
      { optionLabel: 'D', optionText: '400π', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'geometry',
    difficulty: 'MEDIUM',
    questionText: 'In a 30°-60°-90° right triangle, the length of the side opposite the 30° angle is 8 units. What is the length of the side opposite the 60° angle?',
    explanation: 'In a 30°-60°-90° special right triangle, if the shorter leg opposite the 30° angle has length x, then the hypotenuse is 2x and the longer leg opposite 60° is x√3. Since x = 8, the side opposite 60° is 8√3.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '8√2', isCorrect: false },
      { optionLabel: 'B', optionText: '8√3', isCorrect: true },
      { optionLabel: 'C', optionText: '16', isCorrect: false },
      { optionLabel: 'D', optionText: '16√3', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'geometry',
    difficulty: 'MEDIUM',
    questionText: 'A circle with center O has a radius of 12 inches. A central angle intercepts an arc with a length of 8π inches. What is the measure of the central angle in radians?',
    explanation: 'The formula for arc length is s = r * θ, where θ is the angle in radians. Substituting s = 8π and r = 12: 8π = 12 * θ => θ = 8π / 12 = 2π / 3 radians.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: 'π/3 radians', isCorrect: false },
      { optionLabel: 'B', optionText: '2π/3 radians', isCorrect: true },
      { optionLabel: 'C', optionText: '3π/4 radians', isCorrect: false },
      { optionLabel: 'D', optionText: '4π/3 radians', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'geometry',
    difficulty: 'HARD',
    questionText: 'The equation of a circle in the xy-plane is x^2 + y^2 - 8x + 6y = 11. What are the coordinates of the center and the radius of this circle?',
    explanation: 'Complete the square for x and y: (x^2 - 8x + 16) + (y^2 + 6y + 9) = 11 + 16 + 9 => (x - 4)^2 + (y + 3)^2 = 36. In standard form (x - h)^2 + (y - k)^2 = r^2, the center is (4, -3) and the radius is √36 = 6.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: 'Center (-4, 3), radius = 6', isCorrect: false },
      { optionLabel: 'B', optionText: 'Center (4, -3), radius = 6', isCorrect: true },
      { optionLabel: 'C', optionText: 'Center (8, -6), radius = 11', isCorrect: false },
      { optionLabel: 'D', optionText: 'Center (4, -3), radius = 36', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'geometry',
    difficulty: 'HARD',
    questionText: 'In triangle PQR, angle Q is a right angle. If tan(P) = 5/12, what is the value of sin(P)?',
    explanation: 'Using the definition of tangent in a right triangle: tan(P) = opposite / adjacent = 5 / 12. By the Pythagorean theorem, the hypotenuse is √(5^2 + 12^2) = √(25 + 144) = √169 = 13. Therefore, sin(P) = opposite / hypotenuse = 5 / 13.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '5/13', isCorrect: true },
      { optionLabel: 'B', optionText: '12/13', isCorrect: false },
      { optionLabel: 'C', optionText: '13/12', isCorrect: false },
      { optionLabel: 'D', optionText: '12/5', isCorrect: false }
    ]
  },

  // ==========================================
  // READING & WRITING - INFORMATION & IDEAS (5 Questions)
  // ==========================================
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'information-ideas',
    difficulty: 'EASY',
    questionText: 'Biologists studying geothermal hot springs in Yellowstone discovered thermophilic microorganisms thriving at temperatures exceeding 80°C. Further biochemical analysis revealed that the cell membranes of these bacteria contain a high concentration of saturated lipids, which remain stable and resist dissolution in extreme thermal conditions.\n\nAccording to the text, what enables the microorganisms to survive at extreme temperatures?',
    explanation: 'The passage explicitly states that the high concentration of saturated lipids in their cell membranes allows them to remain stable and avoid dissolution under extreme heat.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'Their ability to actively cool the surrounding water', isCorrect: false },
      { optionLabel: 'B', optionText: 'Cell membranes containing heat-stable saturated lipids', isCorrect: true },
      { optionLabel: 'C', optionText: 'A dormant phase during periods of peak geothermal activity', isCorrect: false },
      { optionLabel: 'D', optionText: 'Symbiotic relationships with cold-water algae', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'information-ideas',
    difficulty: 'MEDIUM',
    questionText: 'Economists evaluating municipal green space initiatives noted that urban parks produce positive externalities that are rarely reflected in direct municipal balance sheets. While maintenance costs are immediate and visible, benefits such as reduced storm-water runoff costs, reduced urban heat island mitigation expenses, and improved cardiovascular health outcomes accrue broadly across multiple public budgets over decades.\n\nWhich choice best expresses the main claim of the text?',
    explanation: 'The text argues that the full economic benefits of urban parks are understated because their extensive, cross-budgetary long-term advantages are not captured by direct municipal financial statements.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'Municipalities should eliminate urban green spaces due to prohibitive maintenance expenditures.', isCorrect: false },
      { optionLabel: 'B', optionText: 'The true economic value of urban parks extends well beyond what direct balance sheets typically indicate.', isCorrect: true },
      { optionLabel: 'C', optionText: 'Storm-water runoff is the single largest cost burden facing modern urban centers.', isCorrect: false },
      { optionLabel: 'D', optionText: 'Cardiovascular health improvements can be directly monetized to fund annual park landscaping.', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'information-ideas',
    difficulty: 'MEDIUM',
    questionText: 'Archaeologists examining ceramic vessels from the Indus Valley Civilization identified trace lipids of dairy, ruminant fats, and pulse grains. These discoveries challenge the long-held assumption that ancient urban diets in the region relied almost exclusively on domesticated barley and wheat, suggesting instead that ______.\n\nWhich choice most logically completes the text?',
    explanation: 'The premise states that the discovery of dairy, animal fats, and pulses contradicts the belief in a diet of only barley and wheat. The logical conclusion is that Indus Valley diets were far more varied and diverse than previously assumed.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'Indus Valley populations had a far more diverse and varied culinary economy than previously recognized.', isCorrect: true },
      { optionLabel: 'B', optionText: 'cereal cultivation was completely abandoned in favor of pastoral livestock grazing.', isCorrect: false },
      { optionLabel: 'C', optionText: 'pottery vessels were solely reserved for religious and ritualistic ceremonies.', isCorrect: false },
      { optionLabel: 'D', optionText: 'the civilization was forced to import all essential food staples from neighboring regions.', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'information-ideas',
    difficulty: 'HARD',
    questionText: 'Text 1:\nCognitive psychologists long maintained that bilingualism imparts a generalized executive function advantage, enhancing inhibitory control and task-switching efficiency across all age brackets.\n\nText 2:\nA 2023 meta-analysis of over 150 empirical studies found that while bilingual individuals frequently demonstrate faster reaction times in specific laboratory flanker tasks, this performance delta disappears when controlling for socioeconomic status and test-taking familiarity, questioning the existence of a pervasive cognitive reserve boost.\n\nBased on the texts, how would the author of Text 2 most likely respond to the claims in Text 1?',
    explanation: 'Text 2 argues that the purported cognitive advantage diminishes when confounding factors like socioeconomic status and familiarity are controlled. Thus, the author of Text 2 would contend that the claimed cognitive advantages in Text 1 may be artifacts of methodology rather than an inherent bilingual trait.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'By asserting that the cognitive advantages reported in Text 1 may stem from methodological artifacts rather than bilingualism itself.', isCorrect: true },
      { optionLabel: 'B', optionText: 'By agreeing that executive control improvements are universally measurable across all socioeconomic demographics.', isCorrect: false },
      { optionLabel: 'C', optionText: 'By dismissing the role of inhibitory control in bilingual language acquisition altogether.', isCorrect: false },
      { optionLabel: 'D', optionText: 'By claiming that laboratory flanker tasks are the only reliable indicator of real-world cognitive health.', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'information-ideas',
    difficulty: 'HARD',
    questionText: 'Marine ecologists tracked migration corridors of leatherback sea turtles (Dermochelys coriacea) using acoustic telemetry and satellite tracking. They observed that turtles deviated from historical migratory paths during months when sea surface temperatures were abnormally warm, steering toward higher latitudes with denser jellyfish blooms. This finding indicates that turtle navigation is governed not solely by geomagnetic imprinting, but also by ______.\n\nWhich choice most logically completes the text?',
    explanation: 'The text shows that turtles adjusted their paths according to temperature anomalies and prey availability (jellyfish blooms), showing their navigation responds to real-time environmental and trophic conditions.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'rigid genetic programming that forbids behavioral flexibility.', isCorrect: false },
      { optionLabel: 'B', optionText: 'dynamic responses to environmental conditions and resource availability.', isCorrect: true },
      { optionLabel: 'C', optionText: 'an innate aversion to regions with high commercial maritime transit.', isCorrect: false },
      { optionLabel: 'D', optionText: 'a total reliance on celestial navigation cues during daylight hours.', isCorrect: false }
    ]
  },

  // ==========================================
  // READING & WRITING - CRAFT & STRUCTURE (5 Questions)
  // ==========================================
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'craft-structure',
    difficulty: 'EASY',
    questionText: 'Despite intense scrutiny from peer reviewers, the climatologist presented findings so meticulously documented that her core conclusions were virtually ______.\n\nWhich choice completes the text with the most logical and precise word?',
    explanation: '"Incontrovertible" means impossible to deny or disprove, which directly aligns with the idea that her meticulous documentation stood up against intense scrutiny.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'equivocal', isCorrect: false },
      { optionLabel: 'B', optionText: 'controvertible', isCorrect: false },
      { optionLabel: 'C', optionText: 'incontrovertible', isCorrect: true },
      { optionLabel: 'D', optionText: 'redundant', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'craft-structure',
    difficulty: 'MEDIUM',
    questionText: 'The author of the monograph rejects the simplistic dichotomy between agrarian and industrial societies, arguing that early factory towns maintained extensive communal gardens that ______ standard historical categorizations.\n\nWhich choice completes the text with the most logical and precise word?',
    explanation: '"Defied" or "complicated" indicates that the communal gardens didn\'t fit neatly into the standard either/or historical categories.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'corroborated', isCorrect: false },
      { optionLabel: 'B', optionText: 'complicated', isCorrect: true },
      { optionLabel: 'C', optionText: 'standardized', isCorrect: false },
      { optionLabel: 'D', optionText: 'reiterated', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'craft-structure',
    difficulty: 'MEDIUM',
    questionText: 'In his 1903 essay, W. E. B. Du Bois introduced the concept of "double consciousness" to describe the psychological challenge of viewing oneself through the lens of a society that devalues one\'s identity. In the context of the essay, the author\'s primary rhetorical purpose is to ______.\n\nWhich choice best states the primary purpose of the text?',
    explanation: 'Du Bois introduced "double consciousness" to articulate and conceptualize the internal conflict experienced by African Americans living in a racially stratified society.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'conceptualize the psychological duality experienced by marginalized individuals in a divided society.', isCorrect: true },
      { optionLabel: 'B', optionText: 'critique the statistical methodologies utilized by contemporary social researchers.', isCorrect: false },
      { optionLabel: 'C', optionText: 'advocate for the complete dismantling of international trade barriers.', isCorrect: false },
      { optionLabel: 'D', optionText: 'outline an educational curriculum focused exclusively on vocational skills training.', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'craft-structure',
    difficulty: 'HARD',
    questionText: 'While the initial public reception of the architectural renovation was decidedly lukewarm, subsequent critical appraisal has ______ the architect\'s bold integration of salvaged materials with minimalist steel framework.\n\nWhich choice completes the text with the most logical and precise word?',
    explanation: 'The contrast word "While" sets up a shift from the initial "lukewarm" (unenthusiastic) reception to positive recognition. "Vindicated" means cleared of blame or proved to be right and praiseworthy.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'undermined', isCorrect: false },
      { optionLabel: 'B', optionText: 'vindicated', isCorrect: true },
      { optionLabel: 'C', optionText: 'berated', isCorrect: false },
      { optionLabel: 'D', optionText: 'overshadowed', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'craft-structure',
    difficulty: 'HARD',
    questionText: 'In literary criticism, the term "unreliable narrator" refers to a speaker whose credibility is compromised by psychological bias, ignorance, or intentional deceit. By employing such a narrator in the novel, the author creates dramatic irony, ensuring that the reader\'s understanding of events ______ that of the protagonist.\n\nWhich choice completes the text with the most logical and precise word or phrase?',
    explanation: 'With dramatic irony and an unreliable narrator, the reader perceives the truth that the narrator cannot or will not see; thus, the reader\'s understanding diverges from (or surpasses) the protagonist\'s understanding.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'diverges sharply from', isCorrect: true },
      { optionLabel: 'B', optionText: 'mirrors exactly', isCorrect: false },
      { optionLabel: 'C', optionText: 'concurs unreservedly with', isCorrect: false },
      { optionLabel: 'D', optionText: 'is completely dictated by', isCorrect: false }
    ]
  },

  // ==========================================
  // READING & WRITING - EXPRESSION OF IDEAS (5 Questions)
  // ==========================================
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'expression-ideas',
    difficulty: 'EASY',
    questionText: 'Traditional incandescent light bulbs convert only about 10 percent of their electrical energy into visible light, with the remainder dissipating as waste heat. ______, modern light-emitting diodes (LEDs) convert up to 90 percent of energy into light, drastically reducing municipal electricity consumption.\n\nWhich choice completes the text with the most logical transition?',
    explanation: 'The sentence introduces a direct contrast between the inefficiency of incandescent bulbs and the high efficiency of LEDs. "By contrast" is the ideal transition.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'By contrast', isCorrect: true },
      { optionLabel: 'B', optionText: 'Similarly', isCorrect: false },
      { optionLabel: 'C', optionText: 'As a result', isCorrect: false },
      { optionLabel: 'D', optionText: 'For instance', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'expression-ideas',
    difficulty: 'MEDIUM',
    questionText: 'While researching a topic, a student has taken the following notes:\n• The James Webb Space Telescope (JWST) launched in December 2021.\n• It operates in the infrared spectrum to observe the earliest galaxies formed after the Big Bang.\n• The Hubble Space Telescope primarily observes in visible and ultraviolet light.\n• Infrared wavelengths can penetrate dense cosmic dust clouds that scatter visible light.\n• The student wants to emphasize how JWST\'s observation capability differs from Hubble\'s.\n\nWhich choice most effectively uses the relevant information from the notes to accomplish this goal?',
    explanation: 'The prompt requires contrasting JWST\'s capability with Hubble\'s. Choice C explicitly highlights how JWST\'s infrared focus allows it to penetrate dust clouds that obstruct Hubble\'s visible-light observations.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'Launched in December 2021, the James Webb Space Telescope studies the earliest galaxies formed in the universe.', isCorrect: false },
      { optionLabel: 'B', optionText: 'Infrared wavelengths penetrate dense cosmic dust clouds, which is why scientists rely on space-based observatories.', isCorrect: false },
      { optionLabel: 'C', optionText: 'Unlike Hubble, which observes in visible and ultraviolet light, JWST operates in the infrared spectrum to penetrate cosmic dust clouds.', isCorrect: true },
      { optionLabel: 'D', optionText: 'Both the Hubble Space Telescope and JWST are celebrated observatories positioned outside Earth\'s atmosphere.', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'expression-ideas',
    difficulty: 'MEDIUM',
    questionText: 'The discovery of the Burgess Shale fossils in 1909 revolutionized evolutionary paleontology by revealing an astonishing array of complex multicellular organisms from the Cambrian period. ______, it provided crucial fossil evidence for the rapid evolutionary diversification known as the "Cambrian Explosion."\n\nWhich choice completes the text with the most logical transition?',
    explanation: 'The second sentence adds a further significant impact of the discovery to the first sentence. "Moreover" correctly signals an additional supporting point.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'Nevertheless', isCorrect: false },
      { optionLabel: 'B', optionText: 'Moreover', isCorrect: true },
      { optionLabel: 'C', optionText: 'Conversely', isCorrect: false },
      { optionLabel: 'D', optionText: 'Otherwise', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'expression-ideas',
    difficulty: 'HARD',
    questionText: 'While researching a topic, a student has taken the following notes:\n• Mary Golda Ross was the first known Native American female engineer.\n• She joined Lockheed Aircraft Corporation in 1942 as a mathematician.\n• She was one of the founding members of the secretive Skunk Works project.\n• She contributed to foundational design concepts for interplanetary space travel and ballistic missile systems.\n• The student wants to introduce Mary Golda Ross and her primary historical significance to an audience unfamiliar with her.\n\nWhich choice most effectively uses the relevant information from the notes to accomplish this goal?',
    explanation: 'The goal is to introduce Ross and her primary historical significance to an unfamiliar audience. Choice A introduces her full identity as the first known Native American female engineer and summarizes her pioneering aerospace contributions at Lockheed\'s Skunk Works.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'Mary Golda Ross, the first known Native American female engineer, was a foundational aerospace pioneer who contributed to interplanetary space travel concepts at Lockheed\'s Skunk Works.', isCorrect: true },
      { optionLabel: 'B', optionText: 'In 1942, Lockheed Aircraft Corporation hired a mathematician named Mary Golda Ross.', isCorrect: false },
      { optionLabel: 'C', optionText: 'Interplanetary space exploration relies on foundational design concepts developed during the twentieth century.', isCorrect: false },
      { optionLabel: 'D', optionText: 'The Skunk Works project included many talented mathematicians who worked on ballistic missile defense.', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'expression-ideas',
    difficulty: 'MEDIUM',
    questionText: 'Urban planners frequently recommend increasing residential density around transit hubs to reduce automotive dependency. ______, when high-frequency rail stations are surrounded by pedestrian-friendly apartment complexes, vehicle miles traveled per household drop by over 40 percent.\n\nWhich choice completes the text with the most logical transition?',
    explanation: 'The second sentence provides a specific empirical demonstration of the general claim made in the first sentence. "Specifically" introduces this concrete example perfectly.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'Specifically', isCorrect: true },
      { optionLabel: 'B', optionText: 'In spite of this', isCorrect: false },
      { optionLabel: 'C', optionText: 'Alternatively', isCorrect: false },
      { optionLabel: 'D', optionText: 'Meanwhile', isCorrect: false }
    ]
  },

  // ==========================================
  // READING & WRITING - STANDARD ENGLISH CONVENTIONS (5 Questions)
  // ==========================================
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'conventions',
    difficulty: 'EASY',
    questionText: 'Neither the lead research scientist nor her laboratory ______ present at the symposium when the groundbreaking findings were unveiled.\n\nWhich choice completes the text so that it conforms to the conventions of Standard English?',
    explanation: 'With correlative conjunctions like "neither... nor", the verb agrees with the closer subject ("her laboratory assistants", which is plural). Therefore, the past plural verb "were" is correct.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'assistants was', isCorrect: false },
      { optionLabel: 'B', optionText: 'assistants were', isCorrect: true },
      { optionLabel: 'C', optionText: 'assistant were', isCorrect: false },
      { optionLabel: 'D', optionText: 'assistants is', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'conventions',
    difficulty: 'MEDIUM',
    questionText: 'The architect carefully evaluated three building materials for the coastal museum facade ______ limestone, marine-grade aluminum, and treated cedar.\n\nWhich choice completes the text so that it conforms to the conventions of Standard English?',
    explanation: 'A colon is used after an independent clause ("The architect carefully evaluated three building materials for the coastal museum facade") to introduce a list or explanation.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'facade:', isCorrect: true },
      { optionLabel: 'B', optionText: 'facade;', isCorrect: false },
      { optionLabel: 'C', optionText: 'facade, and', isCorrect: false },
      { optionLabel: 'D', optionText: 'facade', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'conventions',
    difficulty: 'MEDIUM',
    questionText: 'Having analyzed over four thousand deep-sea sediment cores, ______.\n\nWhich choice completes the text so that it conforms to the conventions of Standard English?',
    explanation: 'The introductory modifier "Having analyzed over four thousand deep-sea sediment cores" must describe the subject that immediately follows it. The scientists (or research team) performed the analysis, not the correlation, data, or expedition.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'a distinct correlation between oceanic temperature anomalies and glacial retreat was documented by the oceanographers.', isCorrect: false },
      { optionLabel: 'B', optionText: 'the oceanographers documented a distinct correlation between oceanic temperature anomalies and glacial retreat.', isCorrect: true },
      { optionLabel: 'C', optionText: 'the data revealed to the oceanographers a distinct correlation between temperatures and ice loss.', isCorrect: false },
      { optionLabel: 'D', optionText: 'the research vessel\'s findings confirmed the historical temperature anomalies.', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'conventions',
    difficulty: 'HARD',
    questionText: 'The collection of rare Mesoamerican codices, which ______ meticulously preserved in temperature-controlled vaults at the university library, contains detailed astrological calendars.\n\nWhich choice completes the text so that it conforms to the conventions of Standard English?',
    explanation: 'The subject of the relative clause is "which", referring back to the singular noun phrase "The collection" (or referring to the collection as an entity that is preserved). "is" agrees in number with the singular subject "collection".',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'is', isCorrect: true },
      { optionLabel: 'B', optionText: 'are', isCorrect: false },
      { optionLabel: 'C', optionText: 'were being', isCorrect: false },
      { optionLabel: 'D', optionText: 'have been', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'conventions',
    difficulty: 'HARD',
    questionText: 'Photosynthetic organisms capture sunlight and convert it into chemical energy ______ however, extreme drought can inhibit the enzymatic reactions necessary for carbon fixation.\n\nWhich choice completes the text so that it conforms to the conventions of Standard English?',
    explanation: 'Connecting two independent clauses with the conjunctive adverb "however" requires a semicolon before "however" and a comma after it: "; however,".',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'energy, however,', isCorrect: false },
      { optionLabel: 'B', optionText: 'energy; however,', isCorrect: true },
      { optionLabel: 'C', optionText: 'energy however', isCorrect: false },
      { optionLabel: 'D', optionText: 'energy: however', isCorrect: false }
    ]
  }
];

import { ADDITIONAL_60_SAT_QUESTIONS } from './massiveSatData.js';

export const SAT_EXPANDED_QUESTIONS = [
  ...SAT_INITIAL_40_QUESTIONS,
  ...ADDITIONAL_60_SAT_QUESTIONS
];
