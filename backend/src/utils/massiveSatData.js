/**
 * SATELITE.UZ - Massive Digital SAT Practice Question Bank Extension
 * 60 Additional Authentic SAT Practice Questions across all Domains & Topics
 * Total Questions in this pack: 60 (30 Math + 30 Reading & Writing)
 */

export const ADDITIONAL_60_SAT_QUESTIONS = [
  // ==========================================
  // MATHEMATICS - ALGEBRA (8 Questions)
  // ==========================================
  {
    subjectSlug: 'math',
    topicSlug: 'algebra',
    difficulty: 'EASY',
    questionText: 'If (2/3)x + 5 = 17, what is the value of 2x - 3?',
    explanation: 'Subtract 5 from both sides: (2/3)x = 12. Multiply by 3/2: x = 12 * (3/2) = 18. Then 2x - 3 = 2(18) - 3 = 36 - 3 = 33.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '27', isCorrect: false },
      { optionLabel: 'B', optionText: '30', isCorrect: false },
      { optionLabel: 'C', optionText: '33', isCorrect: true },
      { optionLabel: 'D', optionText: '36', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'algebra',
    difficulty: 'MEDIUM',
    questionText: 'A high school drama club sells student tickets for $6 each and adult tickets for $10 each. For their opening night performance, the club sold 240 tickets in total and collected $1,880. How many student tickets were sold?',
    explanation: 'Let s be student tickets and a be adult tickets. System: s + a = 240 => a = 240 - s. Substitute into revenue equation: 6s + 10(240 - s) = 1880 => 6s + 2400 - 10s = 1880 => -4s = 1880 - 2400 = -520 => s = 130 student tickets.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '110', isCorrect: false },
      { optionLabel: 'B', optionText: '120', isCorrect: false },
      { optionLabel: 'C', optionText: '130', isCorrect: true },
      { optionLabel: 'D', optionText: '140', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'algebra',
    difficulty: 'MEDIUM',
    questionText: 'If 3x - 5y = 14 and x + 2y = 1, what is the value of x - y?',
    explanation: 'From the second equation, x = 1 - 2y. Substitute into the first: 3(1 - 2y) - 5y = 14 => 3 - 6y - 5y = 14 => -11y = 11 => y = -1. Then x = 1 - 2(-1) = 3. Finally, x - y = 3 - (-1) = 4.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '2', isCorrect: false },
      { optionLabel: 'B', optionText: '3', isCorrect: false },
      { optionLabel: 'C', optionText: '4', isCorrect: true },
      { optionLabel: 'D', optionText: '5', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'algebra',
    difficulty: 'HARD',
    questionText: 'Which value of b will cause the linear equation 4(3x - 2) + b = 2(6x + 5) to have infinitely many solutions for all real values of x?',
    explanation: 'Expand both sides: Left side = 12x - 8 + b. Right side = 12x + 10. For infinitely many solutions, constant terms must be equal: -8 + b = 10 => b = 18.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '2', isCorrect: false },
      { optionLabel: 'B', optionText: '10', isCorrect: false },
      { optionLabel: 'C', optionText: '14', isCorrect: false },
      { optionLabel: 'D', optionText: '18', isCorrect: true }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'algebra',
    difficulty: 'MEDIUM',
    questionText: 'A commercial printer depreciates in value according to the linear model V(t) = 32000 - 3500t, where V is the value in dollars and t is the time in years since purchase. What is the meaning of the number 3500 in this context?',
    explanation: 'In the linear model V = -3500t + 32000, 3500 is the rate of change (slope magnitude). It represents the annual decrease in the value of the printer.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: 'The initial purchase price of the commercial printer', isCorrect: false },
      { optionLabel: 'B', optionText: 'The amount by which the printer value decreases each year', isCorrect: true },
      { optionLabel: 'C', optionText: 'The estimated scrap value after 10 years', isCorrect: false },
      { optionLabel: 'D', optionText: 'The total maintenance cost over the printer lifetime', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'algebra',
    difficulty: 'HARD',
    questionText: 'If |3x - 7| = 2x + 1, what is the sum of all distinct real solutions to the equation?',
    explanation: 'Case 1: 3x - 7 = 2x + 1 => x = 8. (Check: |24 - 7| = 17, 2(8)+1 = 17, valid). Case 2: 3x - 7 = -(2x + 1) = -2x - 1 => 5x = 6 => x = 6/5. (Check: |18/5 - 35/5| = 17/5, 2(6/5)+1 = 17/5, valid). Both are solutions. Sum = 8 + 6/5 = 40/5 + 6/5 = 46/5 = 9.2.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '8', isCorrect: false },
      { optionLabel: 'B', optionText: '8.4', isCorrect: false },
      { optionLabel: 'C', optionText: '9.2', isCorrect: true },
      { optionLabel: 'D', optionText: '10.5', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'algebra',
    difficulty: 'EASY',
    questionText: 'A catering service charges a $75 setup fee plus $14 per person. If a corporate lunch has a maximum budget of $500, what is the maximum number of people that can attend?',
    explanation: 'Set up inequality: 14p + 75 ≤ 500 => 14p ≤ 425 => p ≤ 425 / 14 ≈ 30.35. Since the number of people must be an integer, the maximum is 30 people.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '28', isCorrect: false },
      { optionLabel: 'B', optionText: '29', isCorrect: false },
      { optionLabel: 'C', optionText: '30', isCorrect: true },
      { optionLabel: 'D', optionText: '31', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'algebra',
    difficulty: 'MEDIUM',
    questionText: 'Line m passes through (1, -4) and (5, 8). What is the slope of line m?',
    explanation: 'Use the slope formula: m = (y2 - y1) / (x2 - x1) = (8 - (-4)) / (5 - 1) = 12 / 4 = 3.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '2', isCorrect: false },
      { optionLabel: 'B', optionText: '3', isCorrect: true },
      { optionLabel: 'C', optionText: '4', isCorrect: false },
      { optionLabel: 'D', optionText: '1/3', isCorrect: false }
    ]
  },

  // ==========================================
  // MATHEMATICS - ADVANCED MATH (8 Questions)
  // ==========================================
  {
    subjectSlug: 'math',
    topicSlug: 'advanced-math',
    difficulty: 'MEDIUM',
    questionText: 'What is the sum of the solutions to the quadratic equation 2x^2 - 10x + 7 = 0?',
    explanation: 'By Vieta formulas, for ax^2 + bx + c = 0, the sum of solutions is -b / a. Here a = 2 and b = -10, so Sum = -(-10) / 2 = 10 / 2 = 5.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '3.5', isCorrect: false },
      { optionLabel: 'B', optionText: '5', isCorrect: true },
      { optionLabel: 'C', optionText: '-5', isCorrect: false },
      { optionLabel: 'D', optionText: '7', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'advanced-math',
    difficulty: 'MEDIUM',
    questionText: 'The graph of y = -3(x + 2)^2 + 15 in the xy-plane is a parabola. Which statement about the parabola is true?',
    explanation: 'The quadratic is in vertex form y = a(x - h)^2 + k with a = -3, h = -2, k = 15. Since a < 0, the parabola opens downward and has a maximum at vertex (-2, 15).',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: 'The parabola opens upward with a minimum at (-2, 15).', isCorrect: false },
      { optionLabel: 'B', optionText: 'The parabola opens downward with a maximum at (-2, 15).', isCorrect: true },
      { optionLabel: 'C', optionText: 'The parabola opens downward with a maximum at (2, 15).', isCorrect: false },
      { optionLabel: 'D', optionText: 'The parabola opens upward with a minimum at (2, -15).', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'advanced-math',
    difficulty: 'HARD',
    questionText: 'Which expression is equivalent to (x^2 - 9) / (2x^2 + 5x - 3) for all x where the denominator is non-zero?',
    explanation: 'Factor numerator: (x - 3)(x + 3). Factor denominator: (2x - 1)(x + 3). Cancel common factor (x + 3): (x - 3) / (2x - 1).',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '(x - 3) / (2x - 1)', isCorrect: true },
      { optionLabel: 'B', optionText: '(x + 3) / (2x - 1)', isCorrect: false },
      { optionLabel: 'C', optionText: '(x - 3) / (2x + 1)', isCorrect: false },
      { optionLabel: 'D', optionText: '1 / (2x - 1)', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'advanced-math',
    difficulty: 'HARD',
    questionText: 'If f(x) = x^2 - 4x and g(x) = f(x + 3) - 2, what is the value of g(1)?',
    explanation: 'First evaluate g(1): g(1) = f(1 + 3) - 2 = f(4) - 2. Calculate f(4): f(4) = 4^2 - 4(4) = 16 - 16 = 0. Then g(1) = 0 - 2 = -2.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '-4', isCorrect: false },
      { optionLabel: 'B', optionText: '-2', isCorrect: true },
      { optionLabel: 'C', optionText: '0', isCorrect: false },
      { optionLabel: 'D', optionText: '2', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'advanced-math',
    difficulty: 'MEDIUM',
    questionText: 'A radioactive substance decays according to M(t) = 800 * (1/2)^(t / 24), where M is the remaining mass in milligrams and t is the time in hours. What was the initial mass, and what is the half-life of the substance?',
    explanation: 'In M(t) = M0 * (1/2)^(t / h), M0 is the initial mass (t = 0 => 800 mg) and h is the half-life (24 hours).',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: 'Initial mass = 400 mg, half-life = 12 hours', isCorrect: false },
      { optionLabel: 'B', optionText: 'Initial mass = 800 mg, half-life = 24 hours', isCorrect: true },
      { optionLabel: 'C', optionText: 'Initial mass = 800 mg, half-life = 48 hours', isCorrect: false },
      { optionLabel: 'D', optionText: 'Initial mass = 1600 mg, half-life = 24 hours', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'advanced-math',
    difficulty: 'HARD',
    questionText: 'What is the real solution to the radical equation √(3x + 10) = x + 2?',
    explanation: 'Square both sides: 3x + 10 = (x + 2)^2 => 3x + 10 = x^2 + 4x + 4 => x^2 + x - 6 = 0 => (x + 3)(x - 2) = 0. Check x = -3: √(-9 + 10) = √1 = 1, but -3 + 2 = -1 (extraneous!). Check x = 2: √(6 + 10) = √16 = 4, and 2 + 2 = 4 (valid!). The only real solution is x = 2.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: 'x = -3', isCorrect: false },
      { optionLabel: 'B', optionText: 'x = 2', isCorrect: true },
      { optionLabel: 'C', optionText: 'x = -3 and x = 2', isCorrect: false },
      { optionLabel: 'D', optionText: 'No real solution', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'advanced-math',
    difficulty: 'EASY',
    questionText: 'If 3^(2x - 1) = 27, what is the value of x?',
    explanation: 'Express 27 as a power of 3: 27 = 3^3. Set exponents equal: 2x - 1 = 3 => 2x = 4 => x = 2.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '1', isCorrect: false },
      { optionLabel: 'B', optionText: '2', isCorrect: true },
      { optionLabel: 'C', optionText: '3', isCorrect: false },
      { optionLabel: 'D', optionText: '4', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'advanced-math',
    difficulty: 'HARD',
    questionText: 'Given that i = √(-1), which complex number is equivalent to (4 + 3i)(2 - i)?',
    explanation: 'Use FOIL: (4)(2) + (4)(-i) + (3i)(2) + (3i)(-i) = 8 - 4i + 6i - 3(i^2). Since i^2 = -1, -3(-1) = +3. Combining real and imaginary parts: (8 + 3) + (-4i + 6i) = 11 + 2i.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '5 + 2i', isCorrect: false },
      { optionLabel: 'B', optionText: '8 - 3i', isCorrect: false },
      { optionLabel: 'C', optionText: '11 + 2i', isCorrect: true },
      { optionLabel: 'D', optionText: '11 - 2i', isCorrect: false }
    ]
  },

  // ==========================================
  // MATHEMATICS - PROBLEM SOLVING & DATA ANALYSIS (7 Questions)
  // ==========================================
  {
    subjectSlug: 'math',
    topicSlug: 'problem-solving',
    difficulty: 'EASY',
    questionText: 'The price of a digital tablet increased from $400 to $460. What was the percentage increase in the price of the tablet?',
    explanation: 'Percentage increase = (New - Old) / Old * 100% = (460 - 400) / 400 * 100% = 60 / 400 * 100% = 15%.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '12%', isCorrect: false },
      { optionLabel: 'B', optionText: '15%', isCorrect: true },
      { optionLabel: 'C', optionText: '18%', isCorrect: false },
      { optionLabel: 'D', optionText: '60%', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'problem-solving',
    difficulty: 'MEDIUM',
    questionText: 'In a shipment of 800 microchips, 4% are found to be defective. In a second shipment of 1,200 microchips, 6% are defective. If both shipments are combined, what percentage of the total microchips are defective?',
    explanation: 'Defective in first shipment = 800 * 0.04 = 32. Defective in second shipment = 1200 * 0.06 = 72. Total defective = 32 + 72 = 104. Total chips = 800 + 1200 = 2000. Combined percentage = 104 / 2000 = 0.052 = 5.2%.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '5.0%', isCorrect: false },
      { optionLabel: 'B', optionText: '5.2%', isCorrect: true },
      { optionLabel: 'C', optionText: '5.4%', isCorrect: false },
      { optionLabel: 'D', optionText: '5.6%', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'problem-solving',
    difficulty: 'MEDIUM',
    questionText: 'A scatterplot shows the relationship between hours of study, x, and exam score, y. The line of best fit is given by y = 6.5x + 48. If a student studied for 6 hours and earned an actual score of 91, what is the residual (actual score minus predicted score)?',
    explanation: 'Predicted score for x = 6: y = 6.5(6) + 48 = 39 + 48 = 87. Residual = Actual - Predicted = 91 - 87 = +4.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '-4', isCorrect: false },
      { optionLabel: 'B', optionText: '+4', isCorrect: true },
      { optionLabel: 'C', optionText: '+6', isCorrect: false },
      { optionLabel: 'D', optionText: '+7', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'problem-solving',
    difficulty: 'HARD',
    questionText: 'A randomized clinical trial samples 400 patients to test the efficacy of a new therapy, yielding a 95% confidence interval of [68%, 76%]. If the researchers want to reduce the margin of error by half while maintaining the same 95% confidence level, how should they adjust the sample size?',
    explanation: 'The margin of error is inversely proportional to the square root of sample size (ME ∝ 1/√n). To halve the margin of error (multiply by 1/2), the sample size under the radical must be quadrupled (4 * 400 = 1,600 patients).',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: 'Double the sample size to 800 patients', isCorrect: false },
      { optionLabel: 'B', optionText: 'Quadruple the sample size to 1,600 patients', isCorrect: true },
      { optionLabel: 'C', optionText: 'Halve the sample size to 200 patients', isCorrect: false },
      { optionLabel: 'D', optionText: 'Increase the sample size to 1,200 patients', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'problem-solving',
    difficulty: 'MEDIUM',
    questionText: 'Data set X has values {12, 14, 15, 15, 16, 18, 20} with mean 15.7 and standard deviation s1. Data set Y is obtained by multiplying every value in data set X by 3. Which statement correctly describes the mean and standard deviation of data set Y compared to data set X?',
    explanation: 'Multiplying every value in a dataset by a constant k multiplies both the mean and the standard deviation by k. Thus, the new mean is 3 times greater, and the new standard deviation is 3 * s1.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: 'The mean is multiplied by 3, but the standard deviation remains unchanged.', isCorrect: false },
      { optionLabel: 'B', optionText: 'Both the mean and standard deviation are multiplied by 3.', isCorrect: true },
      { optionLabel: 'C', optionText: 'The mean is unchanged, but the standard deviation is tripled.', isCorrect: false },
      { optionLabel: 'D', optionText: 'The standard deviation is multiplied by 9.', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'problem-solving',
    difficulty: 'EASY',
    questionText: 'An athlete runs at a steady pace of 5 meters per second. What is this speed in kilometers per hour? (1 km = 1,000 meters; 1 hour = 3,600 seconds)',
    explanation: '5 m/s = (5 meters / 1 second) * (1 km / 1000 m) * (3600 s / 1 hour) = (5 * 3600) / 1000 = 18,000 / 1000 = 18 km/h.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '15 km/h', isCorrect: false },
      { optionLabel: 'B', optionText: '18 km/h', isCorrect: true },
      { optionLabel: 'C', optionText: '20 km/h', isCorrect: false },
      { optionLabel: 'D', optionText: '24 km/h', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'problem-solving',
    difficulty: 'MEDIUM',
    questionText: 'A box plot represents the weekly wages of employees at a logistics warehouse. The minimum is $420, Q1 is $540, median is $680, Q3 is $820, and maximum is $1,150. What is the interquartile range (IQR) of the wages?',
    explanation: 'The interquartile range is defined as IQR = Q3 - Q1 = $820 - $540 = $280.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '$140', isCorrect: false },
      { optionLabel: 'B', optionText: '$260', isCorrect: false },
      { optionLabel: 'C', optionText: '$280', isCorrect: true },
      { optionLabel: 'D', optionText: '$730', isCorrect: false }
    ]
  },

  // ==========================================
  // MATHEMATICS - GEOMETRY & TRIGONOMETRY (7 Questions)
  // ==========================================
  {
    subjectSlug: 'math',
    topicSlug: 'geometry',
    difficulty: 'EASY',
    questionText: 'What is the sum of the interior angle measures of a convex hexagon (6 sides)?',
    explanation: 'Use the interior angle sum formula: S = (n - 2) * 180°. For n = 6: (6 - 2) * 180° = 4 * 180° = 720°.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '540°', isCorrect: false },
      { optionLabel: 'B', optionText: '720°', isCorrect: true },
      { optionLabel: 'C', optionText: '900°', isCorrect: false },
      { optionLabel: 'D', optionText: '1080°', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'geometry',
    difficulty: 'MEDIUM',
    questionText: 'Triangle ABC is similar to triangle DEF, where vertices A, B, and C correspond to D, E, and F respectively. If AB = 6, DE = 18, and the area of triangle ABC is 20 square units, what is the area of triangle DEF?',
    explanation: 'The scale factor of corresponding sides is k = DE / AB = 18 / 6 = 3. The ratio of their areas is k^2 = 3^2 = 9. Therefore, Area(DEF) = 9 * Area(ABC) = 9 * 20 = 180 square units.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '60', isCorrect: false },
      { optionLabel: 'B', optionText: '120', isCorrect: false },
      { optionLabel: 'C', optionText: '180', isCorrect: true },
      { optionLabel: 'D', optionText: '240', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'geometry',
    difficulty: 'MEDIUM',
    questionText: 'In a circle with center O, central angle AOB measures 80°. Point C lies on the circle such that angle ACB is an inscribed angle subtended by the same arc AB. What is the measure of angle ACB?',
    explanation: 'By the Inscribed Angle Theorem, the measure of an inscribed angle is half the measure of the central angle subtending the same arc. Measure = 80° / 2 = 40°.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '20°', isCorrect: false },
      { optionLabel: 'B', optionText: '40°', isCorrect: true },
      { optionLabel: 'C', optionText: '80°', isCorrect: false },
      { optionLabel: 'D', optionText: '160°', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'geometry',
    difficulty: 'HARD',
    questionText: 'A right cone has a base radius of 6 cm and a slant height of 10 cm. What is the volume of the cone in terms of π? (Recall: V = ⅓πr²h)',
    explanation: 'Find height h using Pythagorean theorem: r^2 + h^2 = (slant height)^2 => 6^2 + h^2 = 10^2 => 36 + h^2 = 100 => h^2 = 64 => h = 8 cm. Volume V = ⅓π(6)^2(8) = ⅓π(36)(8) = 12 * 8 * π = 96π cm³.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '72π', isCorrect: false },
      { optionLabel: 'B', optionText: '96π', isCorrect: true },
      { optionLabel: 'C', optionText: '120π', isCorrect: false },
      { optionLabel: 'D', optionText: '288π', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'geometry',
    difficulty: 'HARD',
    questionText: 'In the xy-plane, a line is tangent to the circle x^2 + y^2 = 25 at the point (3, 4). What is the slope of the tangent line?',
    explanation: 'The center of the circle is (0, 0). The radius to the point of tangency (3, 4) has slope m_radius = (4 - 0) / (3 - 0) = 4/3. A tangent line is perpendicular to the radius at the point of tangency. Thus, the slope of the tangent line is the negative reciprocal: -3/4.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '4/3', isCorrect: false },
      { optionLabel: 'B', optionText: '-4/3', isCorrect: false },
      { optionLabel: 'C', optionText: '-3/4', isCorrect: true },
      { optionLabel: 'D', optionText: '3/4', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'geometry',
    difficulty: 'MEDIUM',
    questionText: 'If sin(θ) = 5/13 and θ is an acute angle, what is the value of cos(θ)?',
    explanation: 'In a right triangle with opposite = 5 and hypotenuse = 13, adjacent side = √(13^2 - 5^2) = √(169 - 25) = √144 = 12. Therefore, cos(θ) = adjacent / hypotenuse = 12 / 13.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '5/12', isCorrect: false },
      { optionLabel: 'B', optionText: '12/13', isCorrect: true },
      { optionLabel: 'C', optionText: '13/12', isCorrect: false },
      { optionLabel: 'D', optionText: '8/13', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'math',
    topicSlug: 'geometry',
    difficulty: 'EASY',
    questionText: 'An isosceles right triangle has legs of length 7 cm. What is the length of its hypotenuse?',
    explanation: 'An isosceles right triangle is a 45°-45°-90° triangle. The hypotenuse is leg * √2 = 7√2 cm.',
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    options: [
      { optionLabel: 'A', optionText: '7', isCorrect: false },
      { optionLabel: 'B', optionText: '7√2', isCorrect: true },
      { optionLabel: 'C', optionText: '7√3', isCorrect: false },
      { optionLabel: 'D', optionText: '14', isCorrect: false }
    ]
  },

  // ==========================================
  // READING & WRITING - INFORMATION & IDEAS (8 Questions)
  // ==========================================
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'information-ideas',
    difficulty: 'EASY',
    questionText: 'Botanists studying the alpine plant Silene acaulis found that its dense cushion-like growth form traps windblown organic debris and retains radiant heat, creating microclimates up to 15°C warmer than the surrounding air. This localized warmth extends the active photosynthetic season of other seedling species that germinate inside the cushion.\n\nAccording to the text, how does Silene acaulis benefit other plant species in alpine environments?',
    explanation: 'The passage explicitly states that by trapping debris and heat, it creates warmer microclimates that extend the photosynthetic season for seedlings germinating within the cushion.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'By releasing chemical repellents against grazing herbivores', isCorrect: false },
      { optionLabel: 'B', optionText: 'By creating localized warm microenvironments that extend photosynthetic activity', isCorrect: true },
      { optionLabel: 'C', optionText: 'By shading seedlings from intense UV mountain radiation', isCorrect: false },
      { optionLabel: 'D', optionText: 'By absorbing all excess rainwater to prevent soil landslides', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'information-ideas',
    difficulty: 'MEDIUM',
    questionText: 'Linguists analyzing historical dialects in mountainous valleys in the Caucasus observed that geographic isolation alone cannot explain dialect diversity. Neighboring settlements separated by only a single ridge often maintained distinct phonological systems for centuries because cultural intermarriage taboos discouraged linguistic exchange, while communities separated by wider distances engaged in regular seasonal trade and shared many lexical items. This suggests that ______.\n\nWhich choice most logically completes the text?',
    explanation: 'The findings contrast geographic proximity with social patterns (intermarriage taboos vs trade), showing that social/cultural factors played a more decisive role than physical terrain in determining dialect diffusion.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'sociocultural dynamics can exert a stronger influence on linguistic divergence than physical geography alone.', isCorrect: true },
      { optionLabel: 'B', optionText: 'trade routes invariably erase all phonetic distinctions among neighboring dialects.', isCorrect: false },
      { optionLabel: 'C', optionText: 'mountainous topography is entirely irrelevant to any linguistic research.', isCorrect: false },
      { optionLabel: 'D', optionText: 'all Caucasian dialects evolved from a single written alphabet established in modern times.', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'information-ideas',
    difficulty: 'MEDIUM',
    questionText: 'Solar panel output degrades over decades due to UV-induced discoloration of ethylene vinyl acetate (EVA) encapsulant layers. Materials scientists developed a fluoropolymer-based coating that filters destructive UV wavelengths while transmitting over 98% of visible light, reducing annual efficiency degradation from 0.8% to 0.15% in accelerated aging tests.\n\nWhich choice best states the primary claim of the passage?',
    explanation: 'The passage explains how the newly developed fluoropolymer coating dramatically mitigates UV-induced solar panel degradation by filtering harmful wavelengths while preserving visible light transmission.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'A novel protective coating substantially minimizes efficiency degradation in photovoltaic panels.', isCorrect: true },
      { optionLabel: 'B', optionText: 'Accelerated aging laboratory tests produce misleading metrics about real-world solar degradation.', isCorrect: false },
      { optionLabel: 'C', optionText: 'Visible light is the primary cause of solar panel discoloration.', isCorrect: false },
      { optionLabel: 'D', optionText: 'Fluoropolymer coatings are prohibitively expensive for commercial manufacturing.', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'information-ideas',
    difficulty: 'HARD',
    questionText: 'Text 1:\nEcologist Robert Paine famously removed starfish (Pisaster ochraceus) from rocky intertidal zones, discovering that in their absence, blue mussels outcompeted all other species, drastically reducing biodiversity. Paine coined the term "keystone predator" to describe how top-down predation maintains community diversity.\n\nText 2:\nSubsequent research in coral reef ecosystems indicates that biodiversity is often shaped primarily by bottom-up availability of architectural refuge space and nutrient upwelling. When structural complexity collapses due to bleaching, top predators remain present but overall species richness plummets regardless.\n\nBased on the texts, how would the researchers in Text 2 view the concept described in Text 1?',
    explanation: 'Text 2 does not reject keystone predation entirely, but demonstrates that in coral ecosystems, bottom-up habitat structure and resource availability are equally or more critical determinants of biodiversity than predation alone.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'As an incomplete explanation for biodiversity maintenance across all marine ecosystems.', isCorrect: true },
      { optionLabel: 'B', optionText: 'As fully verifiable evidence that top predators determine health in every biome.', isCorrect: false },
      { optionLabel: 'C', optionText: 'As a flawed theory caused by improper statistical manipulation of mussel populations.', isCorrect: false },
      { optionLabel: 'D', optionText: 'As an argument that coral bleaching can be resolved by reintroducing intertidal starfish.', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'information-ideas',
    difficulty: 'HARD',
    questionText: 'Neuroscientists observed that sleep deprivation impedes hippocampal consolidation of declarative memories while leaving procedural motor learning relatively intact. Functional MRI scans revealed that during slow-wave sleep, hippocampal sharp-wave ripples replay daytime neural firing sequences to the neocortex. Without slow-wave sleep, this synaptic transfer fails, leaving new factual information vulnerable to ______.\n\nWhich choice most logically completes the text?',
    explanation: 'Because factual information cannot be consolidated into the permanent neocortex without slow-wave sleep, it remains unstable and vulnerable to decay, erasure, or retrogressive loss.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'rapid decay and permanent loss before stabilization.', isCorrect: true },
      { optionLabel: 'B', optionText: 'instantaneous conversion into involuntary motor reflexes.', isCorrect: false },
      { optionLabel: 'C', optionText: 'complete immunity from psychological interference.', isCorrect: false },
      { optionLabel: 'D', optionText: 'permanent storage in peripheral sensory nerves.', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'information-ideas',
    difficulty: 'EASY',
    questionText: 'Urban planners studying pedestrian foot traffic in metropolitan subway stations found that installing wide directional arrows on stairs reduced platform congestion by 34% during morning peak hours. Commuters naturally adhered to designated ascending and descending pathways, preventing opposing pedestrian collisions.\n\nWhich choice best summarizes the main result of the intervention?',
    explanation: 'The passage directly indicates that visual pathway indicators (directional arrows) streamlined stair flow and significantly lowered peak platform congestion.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'Visual navigational cues successfully improved passenger transit flow and reduced congestion.', isCorrect: true },
      { optionLabel: 'B', optionText: 'Subway authorities decided to replace all stairwells with high-speed elevators.', isCorrect: false },
      { optionLabel: 'C', optionText: 'Morning commuters preferred walking against marked pathways.', isCorrect: false },
      { optionLabel: 'D', optionText: 'Stairway modifications increased the overall travel duration for most subway passengers.', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'information-ideas',
    difficulty: 'MEDIUM',
    questionText: 'Analysis of volcanic tephra layers across Greenland ice cores enabled glaciologists to establish precise chronological markers for atmospheric carbon concentrations dating back 120,000 years. Because each major eruption deposits a distinct geochemical fingerprint of glass shards, these ash layers allow researchers to synchronize ice core data with ______.\n\nWhich choice most logically completes the text?',
    explanation: 'Geochemical ash layers act as universal time markers, enabling scientists to cross-reference and correlate ice core dates with sediment records from other global locations.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'marine and terrestrial sediment records worldwide.', isCorrect: true },
      { optionLabel: 'B', optionText: 'satellite temperature measurements collected last year.', isCorrect: false },
      { optionLabel: 'C', optionText: 'hypothetical simulations of future volcanic eruptions.', isCorrect: false },
      { optionLabel: 'D', optionText: 'completely unrelated gravitational wave observations.', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'information-ideas',
    difficulty: 'HARD',
    questionText: 'In a 2022 laboratory trial evaluating microbial biodegradation of low-density polyethylene (LDPE), researchers reported that strain Brevibacillus borstelensis degraded 18% of plastic film mass within 60 days. However, when UV pretreatment was omitted, degradation plummeted to less than 2%, demonstrating that polymer photo-oxidation is ______.\n\nWhich choice most logically completes the text?',
    explanation: 'The dramatic decline from 18% to under 2% when UV pretreatment was missing proves that photo-oxidation is a vital prerequisite or necessary initial step for the bacteria to break down the polymer.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'an essential precursor that enables microbial breakdown of the material.', isCorrect: true },
      { optionLabel: 'B', optionText: 'a harmful interference that sterilizes the beneficial bacteria.', isCorrect: false },
      { optionLabel: 'C', optionText: 'completely redundant when utilizing high concentrations of bacterial culture.', isCorrect: false },
      { optionLabel: 'D', optionText: 'solely responsible for plastic degradation without any biological activity needed.', isCorrect: false }
    ]
  },

  // ==========================================
  // READING & WRITING - CRAFT & STRUCTURE (7 Questions)
  // ==========================================
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'craft-structure',
    difficulty: 'EASY',
    questionText: 'The museum curator noted that while modern restoration techniques can stabilize fragile tapestries, improper humidity control can ______ structural deterioration.\n\nWhich choice completes the text with the most logical and precise word?',
    explanation: '"Accelerate" means to hasten or increase the speed of something, properly contrasting the stabilizing techniques with the risk of hastening decay.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'accelerate', isCorrect: true },
      { optionLabel: 'B', optionText: 'alleviate', isCorrect: false },
      { optionLabel: 'C', optionText: 'substantiate', isCorrect: false },
      { optionLabel: 'D', optionText: 'extinguish', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'craft-structure',
    difficulty: 'MEDIUM',
    questionText: 'Far from presenting an ______ assessment of the proposed municipal zoning reform, the investigative report laid out both its prospective economic boons and its potential burdens on low-income renters with equal rigor.\n\nWhich choice completes the text with the most logical and precise word?',
    explanation: '"One-sided" (or "partisan" / "biased") fits the contrast with an investigation that addressed both pros and cons with equal rigor.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'exhaustive', isCorrect: false },
      { optionLabel: 'B', optionText: 'unilateral', isCorrect: true },
      { optionLabel: 'C', optionText: 'ambivalent', isCorrect: false },
      { optionLabel: 'D', optionText: 'innovative', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'craft-structure',
    difficulty: 'MEDIUM',
    questionText: 'In his landmark treatise on political economy, Adam Smith used the metaphor of the "invisible hand" not to celebrate unfettered selfishness, but to ______ how individual market transactions can serendipitously foster broader communal welfare.\n\nWhich choice completes the text with the most logical and precise word?',
    explanation: '"Illustrate" or "elucidate" means to explain or make clear through example or metaphor.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'elucidate', isCorrect: true },
      { optionLabel: 'B', optionText: 'repudiate', isCorrect: false },
      { optionLabel: 'C', optionText: 'obscure', isCorrect: false },
      { optionLabel: 'D', optionText: 'fabricate', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'craft-structure',
    difficulty: 'HARD',
    questionText: 'The discovery of intact genomic sequences within Pleistocene permafrost samples has sparked fierce debate: bioethicists caution against de-extinction programs, while proponents insist that resurrecting megafauna could ______ ecological balance in damaged tundra biomes.\n\nWhich choice completes the text with the most logical and precise word?',
    explanation: '"Reinvigorate" or "restore" fits the proponents\' optimistic claim that megafauna could bring back or revitalize the ecological health of the tundra.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'destabilize', isCorrect: false },
      { optionLabel: 'B', optionText: 'reinvigorate', isCorrect: true },
      { optionLabel: 'C', optionText: 'curtail', isCorrect: false },
      { optionLabel: 'D', optionText: 'preempt', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'craft-structure',
    difficulty: 'HARD',
    questionText: 'Although the playwright\'s satirical farce was hailed for its biting wit, some theater critics lamented that the caricature of the prime minister was so ______ that it undermined the nuanced political critique developed in the earlier acts.\n\nWhich choice completes the text with the most logical and precise word?',
    explanation: '"Hyperbolic" (excessively exaggerated) explains why the caricature detracted from the nuance of the earlier acts.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'hyperbolic', isCorrect: true },
      { optionLabel: 'B', optionText: 'restrained', isCorrect: false },
      { optionLabel: 'C', optionText: 'somber', isCorrect: false },
      { optionLabel: 'D', optionText: 'didactic', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'craft-structure',
    difficulty: 'MEDIUM',
    questionText: 'In the passage, the author recounts her childhood visits to the Grand Canyon primarily in order to ______.\n\nWhich choice best describes the primary rhetorical purpose of the author\'s reflection?',
    explanation: 'Personal anecdotes in environmental essays commonly serve to ground abstract ecological concepts in tangible human experience and establish personal authority.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'establish a personal connection to the natural landscape before analyzing geological preservation policies.', isCorrect: true },
      { optionLabel: 'B', optionText: 'refute existing tourist attendance statistics compiled by the National Park Service.', isCorrect: false },
      { optionLabel: 'C', optionText: 'argue for the privatization of national park concessions and lodging facilities.', isCorrect: false },
      { optionLabel: 'D', optionText: 'discourage readers from undertaking strenuous outdoor backcountry expeditions.', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'craft-structure',
    difficulty: 'HARD',
    questionText: 'The historian contends that early navigational chronometers were not merely utilitarian timepieces; rather, their remarkable accuracy served to ______ British imperial dominion across oceanic trade routes.\n\nWhich choice completes the text with the most logical and precise word?',
    explanation: '"Consolidate" means to reinforce or strengthen power and control, matching the idea that precision chronometers bolstered maritime dominion.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'undermine', isCorrect: false },
      { optionLabel: 'B', optionText: 'consolidate', isCorrect: true },
      { optionLabel: 'C', optionText: 'dismantle', isCorrect: false },
      { optionLabel: 'D', optionText: 'relinquish', isCorrect: false }
    ]
  },

  // ==========================================
  // READING & WRITING - EXPRESSION OF IDEAS (8 Questions)
  // ==========================================
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'expression-ideas',
    difficulty: 'EASY',
    questionText: 'Commercial aircraft wings generate substantial lift by creating lower air pressure above the wing than below it. ______, aerodynamic drag is an inevitable byproduct of this lift-generating pressure differential.\n\nWhich choice completes the text with the most logical transition?',
    explanation: '"However" indicates that while lift is created, drag is the unavoidable counteracting cost.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'However', isCorrect: true },
      { optionLabel: 'B', optionText: 'Similarly', isCorrect: false },
      { optionLabel: 'C', optionText: 'For example', isCorrect: false },
      { optionLabel: 'D', optionText: 'First', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'expression-ideas',
    difficulty: 'MEDIUM',
    questionText: 'Automated warehouse logistics robots have significantly cut sorting times. ______, errors caused by barcode scanning misalignments have declined by more than 60 percent since implementation.\n\nWhich choice completes the text with the most logical transition?',
    explanation: '"Furthermore" introduces an additional positive outcome that complements the initial benefit of reduced sorting times.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'Nevertheless', isCorrect: false },
      { optionLabel: 'B', optionText: 'Furthermore', isCorrect: true },
      { optionLabel: 'C', optionText: 'Conversely', isCorrect: false },
      { optionLabel: 'D', optionText: 'In spite of this', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'expression-ideas',
    difficulty: 'MEDIUM',
    questionText: 'While researching a topic, a student has taken the following notes:\n• Coral reefs occupy less than 0.1% of the ocean floor.\n• They support over 25% of all known marine species.\n• Ocean acidification decreases the availability of calcium carbonate ions.\n• Corals need calcium carbonate to build their aragonite skeletons.\n• The student wants to highlight the disproportionate biodiversity supported by coral reefs.\n\nWhich choice most effectively uses the relevant information from the notes to accomplish this goal?',
    explanation: 'To highlight the disproportionate biodiversity, choice B contrasts the tiny physical footprint (< 0.1%) with the massive share of marine life supported (> 25%).',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'Ocean acidification reduces calcium carbonate ions, making it hard for corals to construct their skeletons.', isCorrect: false },
      { optionLabel: 'B', optionText: 'Despite covering less than 0.1 percent of the ocean floor, coral reefs support more than 25 percent of all known marine species.', isCorrect: true },
      { optionLabel: 'C', optionText: 'Coral reefs are vital ocean habitats that require aragonite skeletons to thrive in marine waters.', isCorrect: false },
      { optionLabel: 'D', optionText: 'Marine biologists monitor the ocean floor to determine where diverse coral species are distributed.', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'expression-ideas',
    difficulty: 'HARD',
    questionText: 'Ancient Roman aqueducts relied on gravity to transport freshwater from mountain springs to urban centers over distances exceeding 50 miles. Engineers maintained a remarkably consistent downward gradient—frequently less than 1 foot of drop per 1,000 feet of run. ______, the water flowed smoothly without stagnating or eroding the stone channels.\n\nWhich choice completes the text with the most logical transition?',
    explanation: '"Consequently" or "As a result" marks the direct result of the engineers\' meticulous gradient maintenance.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'As a result', isCorrect: true },
      { optionLabel: 'B', optionText: 'On the other hand', isCorrect: false },
      { optionLabel: 'C', optionText: 'Nevertheless', isCorrect: false },
      { optionLabel: 'D', optionText: 'Alternatively', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'expression-ideas',
    difficulty: 'MEDIUM',
    questionText: 'While researching a topic, a student has taken the following notes:\n• Hypatia of Alexandria (circa 360–415 CE) was a renowned philosopher, astronomer, and mathematician.\n• She headed the Neoplatonist school in Alexandria, Egypt.\n• She constructed astrolabes and hydrometers for celestial and fluid observations.\n• She edited the mathematical commentary on Diophantus\'s Arithmetica.\n• The student wants to emphasize Hypatia\'s contributions to scientific instrumentation.\n\nWhich choice most effectively uses the relevant information from the notes to accomplish this goal?',
    explanation: 'The prompt requires emphasizing her contributions to scientific instrumentation. Choice A specifically highlights her construction of astrolabes and hydrometers.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'Beyond her philosophical teachings, Hypatia contributed directly to scientific instrumentation by constructing astrolabes and hydrometers.', isCorrect: true },
      { optionLabel: 'B', optionText: 'Hypatia of Alexandria was a famous thinker who led the Neoplatonist school in ancient Egypt.', isCorrect: false },
      { optionLabel: 'C', optionText: 'Diophantus\'s Arithmetica was a key mathematical text studied in ancient Alexandria.', isCorrect: false },
      { optionLabel: 'D', optionText: 'In approximately 415 CE, intellectual life in Alexandria involved philosophy, astronomy, and mathematics.', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'expression-ideas',
    difficulty: 'EASY',
    questionText: 'The introduction of drip irrigation in arid farmland reduced overall water evaporation by 45 percent. ______, crop yields of drought-sensitive legumes increased significantly due to steady root-zone moisture.\n\nWhich choice completes the text with the most logical transition?',
    explanation: '"In addition" adds a second positive benefit of drip irrigation.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'In addition', isCorrect: true },
      { optionLabel: 'B', optionText: 'In contrast', isCorrect: false },
      { optionLabel: 'C', optionText: 'Instead', isCorrect: false },
      { optionLabel: 'D', optionText: 'Regardless', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'expression-ideas',
    difficulty: 'HARD',
    questionText: 'Architect Frank Lloyd Wright designed Fallingwater to integrate organically into its natural surroundings. He anchored the cantilevered concrete balconies directly into the bedrock above the waterfall. ______, the residence appears not as an intrusion upon the cliffside, but as an organic extension of the rock strata itself.\n\nWhich choice completes the text with the most logical transition?',
    explanation: '"Accordingly" shows how the house\'s visual harmony naturally results from Wright\'s direct cantilever anchoring into the bedrock.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'Accordingly', isCorrect: true },
      { optionLabel: 'B', optionText: 'Nonetheless', isCorrect: false },
      { optionLabel: 'C', optionText: 'Meanwhile', isCorrect: false },
      { optionLabel: 'D', optionText: 'In spite of this', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'expression-ideas',
    difficulty: 'MEDIUM',
    questionText: 'While researching a topic, a student has taken the following notes:\n• The Voyager 1 probe was launched by NASA in September 1977.\n• In August 2012, it crossed the heliopause and entered interstellar space.\n• It carries the Golden Record, containing sounds and images selected to portray the diversity of life on Earth.\n• It continues to transmit plasma density measurements back to Earth.\n• The student wants to highlight the historic milestone of Voyager 1 reaching interstellar space.\n\nWhich choice most effectively uses the relevant information from the notes to accomplish this goal?',
    explanation: 'Choice C specifically spotlights the historic milestone of crossing the heliopause in August 2012 to become the first human-made object in interstellar space.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'Launched in 1977, NASA\'s Voyager 1 carries the Golden Record with sounds and images from Earth.', isCorrect: false },
      { optionLabel: 'B', optionText: 'Instruments on Voyager 1 measure plasma density and transmit findings over billions of miles.', isCorrect: false },
      { optionLabel: 'C', optionText: 'In August 2012, Voyager 1 achieved a historic milestone by crossing the heliopause to become the first spacecraft to enter interstellar space.', isCorrect: true },
      { optionLabel: 'D', optionText: 'Voyager 1 was developed during the late twentieth century to study our solar system.', isCorrect: false }
    ]
  },

  // ==========================================
  // READING & WRITING - STANDARD ENGLISH CONVENTIONS (7 Questions)
  // ==========================================
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'conventions',
    difficulty: 'EASY',
    questionText: 'A complex network of underground fungal filaments, known as mycorrhizae, ______ essential nutrients and water to forest tree roots in exchange for photosynthetic sugars.\n\nWhich choice completes the text so that it conforms to the conventions of Standard English?',
    explanation: 'The subject is "A complex network" (singular), modified by the prepositional phrase "of underground fungal filaments" and parenthetical "known as mycorrhizae". The singular present verb is "delivers".',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'delivers', isCorrect: true },
      { optionLabel: 'B', optionText: 'deliver', isCorrect: false },
      { optionLabel: 'C', optionText: 'are delivering', isCorrect: false },
      { optionLabel: 'D', optionText: 'have delivered', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'conventions',
    difficulty: 'MEDIUM',
    questionText: 'During the high-altitude mountaineering expedition, the climbers encountered severe whiteout ______ they were forced to seek shelter inside a snow cave until morning.\n\nWhich choice completes the text so that it conforms to the conventions of Standard English?',
    explanation: 'Connecting two independent clauses requires a semicolon or a comma with a coordinating conjunction: "conditions; consequently,".',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'conditions consequently', isCorrect: false },
      { optionLabel: 'B', optionText: 'conditions, consequently', isCorrect: false },
      { optionLabel: 'C', optionText: 'conditions; consequently,', isCorrect: true },
      { optionLabel: 'D', optionText: 'conditions: consequently', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'conventions',
    difficulty: 'MEDIUM',
    questionText: 'The international geological conference brought together researchers from Tokyo, Japan ______ Oslo, Norway; and Santiago, Chile.\n\nWhich choice completes the text so that it conforms to the conventions of Standard English?',
    explanation: 'In a complex list where items contain internal commas (City, Country), items must be separated by semicolons: "...Tokyo, Japan; Oslo, Norway; and...".',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: ';', isCorrect: true },
      { optionLabel: 'B', optionText: ',', isCorrect: false },
      { optionLabel: 'C', optionText: ':', isCorrect: false },
      { optionLabel: 'D', optionText: '—', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'conventions',
    difficulty: 'HARD',
    questionText: 'The aerospace engineering team developed three distinct satellite propulsion prototypes, each ______ tested under simulated vacuum chamber conditions.\n\nWhich choice completes the text so that it conforms to the conventions of Standard English?',
    explanation: 'The absolute phrase "each having been thoroughly tested" or "each of which was" functions as an adverbial modifier. "each thoroughly" or "each being" works. Here "of which was" forms a grammatical nonrestrictive clause.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'of which was thoroughly', isCorrect: true },
      { optionLabel: 'B', optionText: 'of which were thoroughly', isCorrect: false },
      { optionLabel: 'C', optionText: 'whom was thoroughly', isCorrect: false },
      { optionLabel: 'D', optionText: 'were thoroughly', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'conventions',
    difficulty: 'HARD',
    questionText: 'Examining the spectral signatures of distant exoplanets, ______.\n\nWhich choice completes the text so that it conforms to the conventions of Standard English?',
    explanation: 'The introductory participial phrase "Examining the spectral signatures of distant exoplanets" must modify the subject that performed the examination: the astrophysicists, not the chemical compounds or telescope data.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'atmospheric water vapor was detected by the astrophysicists in unprecedented concentrations.', isCorrect: false },
      { optionLabel: 'B', optionText: 'the astrophysicists detected atmospheric water vapor in unprecedented concentrations.', isCorrect: true },
      { optionLabel: 'C', optionText: 'the telescope data confirmed the presence of atmospheric water vapor.', isCorrect: false },
      { optionLabel: 'D', optionText: 'unprecedented concentrations of water vapor were confirmed by the research team.', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'conventions',
    difficulty: 'EASY',
    questionText: 'The lead biologist confirmed that ______ migratory route passes through protected national wildlife refuges.\n\nWhich choice completes the text so that it conforms to the conventions of Standard English?',
    explanation: 'The singular possessive of "species" is "species\'" or referring to the flock/birds. "the species\'" is the correct possessive form.',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'the species\'', isCorrect: true },
      { optionLabel: 'B', optionText: 'the species', isCorrect: false },
      { optionLabel: 'C', optionText: 'the species\'s', isCorrect: false },
      { optionLabel: 'D', optionText: 'the specieses', isCorrect: false }
    ]
  },
  {
    subjectSlug: 'reading-writing',
    topicSlug: 'conventions',
    difficulty: 'MEDIUM',
    questionText: 'To succeed in the robotics competition, the team had to design an autonomous chassis, program complex machine vision algorithms, and ______ the mechanical grippers for rapid object sorting.\n\nWhich choice completes the text so that it conforms to the conventions of Standard English?',
    explanation: 'Parallel structure requires matching base verbs in the infinitive series: "to [design]..., [program]..., and [calibrate]...".',
    calculatorAllowed: false,
    referenceSheetAllowed: false,
    options: [
      { optionLabel: 'A', optionText: 'calibrating', isCorrect: false },
      { optionLabel: 'B', optionText: 'calibrate', isCorrect: true },
      { optionLabel: 'C', optionText: 'having calibrated', isCorrect: false },
      { optionLabel: 'D', optionText: 'will calibrate', isCorrect: false }
    ]
  }
];
