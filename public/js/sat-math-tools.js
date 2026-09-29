/**
 * SATELITE.UZ - SAT Math Tools Engine
 * 1. Desmos Graphing Calculator (Official College Board SAT embed & API)
 * 2. Official SAT Math Reference Sheet with Search, Bookmarks, and Categories
 * Preserves question state, selections, and exam timers.
 */

(function () {
  'use strict';

  // Official College Board SAT Reference Data (10 Detailed Sections)
  const SAT_FORMULAS_DATA = [
    {
      id: 'sec-area-volume',
      sectionNumber: 1,
      sectionTitle: 'Area and Volume',
      category: 'Geometry',
      description: 'Standard 2D and 3D geometric measure relationships tested on the SAT.',
      formulas: [
        {
          id: 'circle-area',
          name: 'Area of a Circle',
          math: 'A = πr²',
          description: 'Where r is the radius of the circle. (Official SAT Reference)',
          exampleQuestion: 'A circular flower garden has a diameter of 14 meters. What is the area of the garden in square meters in terms of π?',
          exampleSolution: 'Radius r = 14 / 2 = 7 m. Area A = πr² = π(7)² = 49π m².',
          keywords: ['circle', 'area', 'radius', 'pi', 'pi r squared']
        },
        {
          id: 'circle-circumference',
          name: 'Circumference of a Circle',
          math: 'C = 2πr = πd',
          description: 'Where r is radius and d is diameter. (Official SAT Reference)',
          exampleQuestion: 'The wheel of a bicycle has a radius of 14 inches. How many inches does the bicycle travel in one complete revolution?',
          exampleSolution: 'Distance in one revolution = Circumference C = 2πr = 2π(14) = 28π inches.',
          keywords: ['circumference', 'circle', 'perimeter', 'diameter', 'radius']
        },
        {
          id: 'rectangle-area',
          name: 'Area of a Rectangle',
          math: 'A = ℓw',
          description: 'Where ℓ is length and w is width. (Official SAT Reference)',
          exampleQuestion: 'A rectangular solar panel has a perimeter of 38 feet and a length of 11 feet. What is the area of the panel in square feet?',
          exampleSolution: 'P = 2ℓ + 2w => 38 = 2(11) + 2w => 38 = 22 + 2w => 2w = 16 => w = 8 ft. Area A = ℓw = 11 * 8 = 88 ft².',
          keywords: ['rectangle', 'area', 'length', 'width']
        },
        {
          id: 'triangle-area',
          name: 'Area of a Triangle',
          math: 'A = ½bh',
          description: 'Where b is the base and h is the perpendicular height. (Official SAT Reference)',
          exampleQuestion: 'A right triangle has vertices at (0, 0), (10, 0), and (4, 7). What is the area of the triangle?',
          exampleSolution: 'Base along x-axis b = 10, perpendicular height h = 7. Area A = ½bh = ½(10)(7) = 35.',
          keywords: ['triangle', 'area', 'base', 'height']
        },
        {
          id: 'box-volume',
          name: 'Volume of a Rectangular Prism',
          math: 'V = ℓwh',
          description: 'Where ℓ is length, w is width, and h is height. (Official SAT Reference)',
          exampleQuestion: 'A shipping crate is 12 inches long, 8 inches wide, and 6 inches tall. What is its volume in cubic inches?',
          exampleSolution: 'V = ℓwh = 12 * 8 * 6 = 96 * 6 = 576 in³.',
          keywords: ['volume', 'box', 'prism', 'rectangular', 'length', 'width', 'height']
        },
        {
          id: 'cylinder-volume',
          name: 'Volume of a Right Cylinder',
          math: 'V = πr²h',
          description: 'Where r is the base radius and h is cylinder height. (Official SAT Reference)',
          exampleQuestion: 'A cylindrical silo has a base radius of 4 meters and a height of 15 meters. What is the volume of the silo in cubic meters?',
          exampleSolution: 'V = πr²h = π(4)²(15) = π(16)(15) = 240π m³.',
          keywords: ['cylinder', 'volume', 'radius', 'height', 'pi']
        },
        {
          id: 'sphere-volume',
          name: 'Volume of a Sphere',
          math: 'V = ⁴⁄₃πr³',
          description: 'Where r is the radius of the sphere. (Official SAT Reference)',
          exampleQuestion: 'A spherical gas storage tank has a radius of 6 meters. What is its volume in cubic meters in terms of π?',
          exampleSolution: 'V = ⁴⁄₃πr³ = ⁴⁄₃π(6)³ = ⁴⁄₃π(216) = 4 * 72π = 288π m³.',
          keywords: ['sphere', 'volume', 'radius', 'ball']
        },
        {
          id: 'cone-volume',
          name: 'Volume of a Right Cone',
          math: 'V = ⅓πr²h',
          description: 'Where r is radius and h is height. (Official SAT Reference)',
          exampleQuestion: 'A conical water cup has a height of 9 cm and a top diameter of 8 cm. What is the volume of the cup in cubic centimeters?',
          exampleSolution: 'Radius r = 8/2 = 4 cm. V = ⅓πr²h = ⅓π(4)²(9) = ⅓π(16)(9) = 16 * 3 * π = 48π cm³.',
          keywords: ['cone', 'volume', 'radius', 'height']
        },
        {
          id: 'pyramid-volume',
          name: 'Volume of a Pyramid',
          math: 'V = ⅓ℓwh',
          description: 'Where ℓ is length, w is width, and h is height. (Official SAT Reference)',
          exampleQuestion: 'A pyramid has a rectangular base with length 10 cm, width 6 cm, and height 12 cm. What is its volume?',
          exampleSolution: 'V = ⅓ℓwh = ⅓(10)(6)(12) = ⅓(720) = 240 cm³.',
          keywords: ['pyramid', 'volume', 'base', 'height']
        }
      ]
    },
    {
      id: 'sec-circles',
      sectionNumber: 2,
      sectionTitle: 'Circles & Angle Measurements',
      category: 'Circles',
      description: 'Official relationships for radian and degree measures, arcs, and circle equations.',
      formulas: [
        {
          id: 'circle-degrees-radians',
          name: 'Full Rotation (Degrees & Radians)',
          math: '360° = 2π radians',
          description: 'The number of degrees in a circle is 360. The number of radians is 2π. (Official SAT Reference)',
          exampleQuestion: 'Convert an angle of 210° into radians.',
          exampleSolution: 'Multiply by π / 180°: 210° * (π / 180°) = 210π / 180 = 7π / 6 radians.',
          keywords: ['degrees', 'radians', 'circle', 'rotation', '360', '2pi']
        },
        {
          id: 'arc-length',
          name: 'Arc Length of a Circle',
          math: 's = rθ   (θ in radians) | s = (θ/360) · 2πr',
          description: 'Arc length is proportional to the fraction of the total circumference subtended by central angle θ.',
          exampleQuestion: 'In a circle with radius 12 inches, central angle θ = π/3 radians intercepts an arc. What is the length of the arc?',
          exampleSolution: 's = rθ = 12 * (π/3) = 4π inches.',
          keywords: ['arc', 'length', 'circle', 'radians', 'fraction', 'central angle']
        },
        {
          id: 'sector-area',
          name: 'Area of a Sector',
          math: 'A = ½r²θ   (θ in radians) | A = (θ/360) · πr²',
          description: 'Sector area is the fraction of the circle area subtended by the central angle.',
          exampleQuestion: 'A circular pizza has a radius of 9 inches. A slice has a central angle of 40°. What is the area of the slice?',
          exampleSolution: 'A = (θ / 360°) * πr² = (40 / 360) * π(9)² = (1/9) * 81π = 9π in².',
          keywords: ['sector', 'area', 'slice', 'central angle', 'pie slice']
        },
        {
          id: 'circle-standard-equation',
          name: 'Standard Equation of a Circle',
          math: '(x - h)² + (y - k)² = r²',
          description: 'Center coordinates at (h, k) with radius r on the Cartesian coordinate plane.',
          exampleQuestion: 'What is the center and radius of the circle with equation (x - 5)² + (y + 2)² = 81?',
          exampleSolution: 'In standard form (x - h)² + (y - k)² = r²: Center = (5, -2) and radius r = √81 = 9.',
          keywords: ['circle equation', 'center', 'radius', 'h k', 'conic']
        }
      ]
    },
    {
      id: 'sec-pythagorean',
      sectionNumber: 3,
      sectionTitle: 'Pythagorean Theorem',
      category: 'Triangles',
      description: 'Fundamental relationship among the three sides of a right triangle.',
      formulas: [
        {
          id: 'pythagorean-theorem',
          name: 'Pythagorean Theorem',
          math: 'a² + b² = c²',
          description: 'In a right triangle with legs a and b and hypotenuse c. (Official SAT Reference)',
          exampleQuestion: 'A 13-foot ladder is placed against a vertical wall with the foot of the ladder 5 feet away from the base. How high does the ladder reach?',
          exampleSolution: 'a² + b² = c² => 5² + h² = 13² => 25 + h² = 169 => h² = 144 => h = 12 feet.',
          keywords: ['pythagorean', 'right triangle', 'hypotenuse', 'legs', 'a squared']
        },
        {
          id: 'pythagorean-triples',
          name: 'Common Pythagorean Triples',
          math: '3-4-5  |  5-12-13  |  7-24-25  |  8-15-17',
          description: 'High-frequency integer side lengths (and their multiples, e.g. 6-8-10) tested on the SAT.',
          exampleQuestion: 'A right triangle has legs of length 24 and 32. What is the length of its hypotenuse?',
          exampleSolution: 'Divide both by 8: 24/8 = 3, 32/8 = 4. This is an 8x multiple of the 3-4-5 triple! Hypotenuse = 8 * 5 = 40.',
          keywords: ['triples', '3-4-5', '5-12-13', 'right triangle', 'integers']
        }
      ]
    },
    {
      id: 'sec-special-triangles',
      sectionNumber: 4,
      sectionTitle: 'Special Right Triangles',
      category: 'Triangles',
      description: 'Side length and angle relationships for 30-60-90 and 45-45-90 triangles.',
      formulas: [
        {
          id: 'triangle-30-60-90',
          name: '30° - 60° - 90° Triangle',
          math: 'Sides ratio: x : x√3 : 2x',
          description: 'Opposite 30° is x, opposite 60° is x√3, hypotenuse opposite 90° is 2x. (Official SAT Reference)',
          exampleQuestion: 'In a 30°-60°-90° triangle, the side opposite the 30° angle is 7. What is the length of the hypotenuse and the side opposite 60°?',
          exampleSolution: 'Hypotenuse = 2x = 2(7) = 14. Side opposite 60° = x√3 = 7√3.',
          keywords: ['30 60 90', 'special triangle', 'root 3', 'hypotenuse 2x']
        },
        {
          id: 'triangle-45-45-90',
          name: '45° - 45° - 90° Triangle',
          math: 'Sides ratio: s : s : s√2',
          description: 'Isosceles right triangle. Legs are s and s, hypotenuse is s√2. (Official SAT Reference)',
          exampleQuestion: 'A square has an area of 50 cm². What is the length of its diagonal?',
          exampleSolution: 'Side length s = √50 = 5√2 cm. Diagonal = s√2 = (5√2)(√2) = 5 * 2 = 10 cm.',
          keywords: ['45 45 90', 'isosceles right', 'root 2', 'square diagonal']
        },
        {
          id: 'triangle-angle-sum',
          name: 'Sum of Angles in a Triangle',
          math: '∠A + ∠B + ∠C = 180°',
          description: 'The sum of the measures in degrees of the angles of a triangle is 180. (Official SAT Reference)',
          exampleQuestion: 'In triangle PQR, angle P = 35° and angle Q = 85°. What is the measure of angle R?',
          exampleSolution: 'Sum of angles is 180°: ∠R = 180° - (35° + 85°) = 180° - 120° = 60°.',
          keywords: ['angle sum', 'triangle angles', '180 degrees']
        }
      ]
    },
    {
      id: 'sec-coordinate-geometry',
      sectionNumber: 5,
      sectionTitle: 'Coordinate Geometry',
      category: 'Algebra',
      description: 'Slopes, lines, midpoints, and distance on the coordinate plane.',
      formulas: [
        {
          id: 'slope-formula',
          name: 'Slope of a Line (m)',
          math: 'm = (y₂ - y₁) / (x₂ - x₁)',
          description: 'Rise over run between points (x₁, y₁) and (x₂, y₂).',
          exampleQuestion: 'Find the slope of the line passing through (-3, 4) and (2, -6).',
          exampleSolution: 'm = (y₂ - y₁) / (x₂ - x₁) = (-6 - 4) / (2 - (-3)) = -10 / 5 = -2.',
          keywords: ['slope', 'rise over run', 'gradient', 'line']
        },
        {
          id: 'slope-intercept-form',
          name: 'Slope-Intercept Form',
          math: 'y = mx + b',
          description: 'Where m is the slope and b is the y-intercept (0, b).',
          exampleQuestion: 'Convert 3x - 4y = 12 into slope-intercept form and identify the slope and y-intercept.',
          exampleSolution: '-4y = -3x + 12 => y = (3/4)x - 3. Slope m = 3/4, y-intercept is (0, -3).',
          keywords: ['slope intercept', 'y = mx + b', 'linear equation']
        },
        {
          id: 'point-slope-form',
          name: 'Point-Slope Form',
          math: 'y - y₁ = m(x - x₁)',
          description: 'Line with slope m passing through given point (x₁, y₁).',
          exampleQuestion: 'Write the equation of the line with slope -2 passing through (3, 5).',
          exampleSolution: 'y - y₁ = m(x - x₁) => y - 5 = -2(x - 3) => y = -2x + 6 + 5 => y = -2x + 11.',
          keywords: ['point slope', 'linear line']
        },
        {
          id: 'midpoint-formula',
          name: 'Midpoint Formula',
          math: 'M = ((x₁ + x₂) / 2, (y₁ + y₂) / 2)',
          description: 'Coordinates of the midpoint between two Cartesian points.',
          exampleQuestion: 'Find the midpoint between points A(4, -7) and B(-2, 5).',
          exampleSolution: 'M = ((4 + (-2))/2, (-7 + 5)/2) = (2/2, -2/2) = (1, -1).',
          keywords: ['midpoint', 'center point', 'average coordinates']
        },
        {
          id: 'distance-formula',
          name: 'Distance Formula',
          math: 'd = √((x₂ - x₁)² + (y₂ - y₁)²)',
          description: 'Straight-line Euclidean distance derived from Pythagorean Theorem.',
          exampleQuestion: 'What is the distance between points (2, 3) and (8, 11)?',
          exampleSolution: 'd = √((8 - 2)² + (11 - 3)²) = √(6² + 8²) = √(36 + 64) = √100 = 10.',
          keywords: ['distance', 'length between points', 'euclidean']
        },
        {
          id: 'parallel-perpendicular-slopes',
          name: 'Parallel and Perpendicular Lines',
          math: 'Parallel: m₁ = m₂  |  Perpendicular: m₁ · m₂ = -1',
          description: 'Parallel lines have equal slopes. Perpendicular lines have negative reciprocal slopes.',
          exampleQuestion: 'Line L has equation y = (2/5)x + 3. What is the slope of a line perpendicular to line L?',
          exampleSolution: 'Perpendicular slope is negative reciprocal of 2/5: m_perp = -5/2.',
          keywords: ['parallel', 'perpendicular', 'negative reciprocal', 'slopes']
        }
      ]
    },
    {
      id: 'sec-exponents',
      sectionNumber: 6,
      sectionTitle: 'Exponents & Radicals',
      category: 'Algebra',
      description: 'Rules for multiplying, dividing, and rationalizing powers and radicals.',
      formulas: [
        {
          id: 'exponent-product-rule',
          name: 'Product Rule',
          math: 'xᵃ · xᵇ = xᵃ⁺ᵇ',
          description: 'When multiplying terms with the same base, add their exponents.',
          exampleQuestion: 'Simplify (2x³)(5x⁴).',
          exampleSolution: 'Multiply coefficients: 2 * 5 = 10. Add exponents: x³ * x⁴ = x³⁺⁴ = x⁷. Result = 10x⁷.',
          keywords: ['exponents', 'product rule', 'powers', 'multiplying']
        },
        {
          id: 'exponent-quotient-rule',
          name: 'Quotient Rule',
          math: 'xᵃ / xᵇ = xᵃ⁻ᵇ',
          description: 'When dividing terms with the same base, subtract exponent of denominator.',
          exampleQuestion: 'Simplify (18x⁷y³) / (6x²y⁵).',
          exampleSolution: '18/6 = 3. For x: 7 - 2 = 5 (x⁵). For y: 3 - 5 = -2 (1/y²). Result = 3x⁵ / y².',
          keywords: ['quotient rule', 'dividing powers']
        },
        {
          id: 'exponent-power-rule',
          name: 'Power of a Power',
          math: '(xᵃ)ᵇ = xᵃᵇ',
          description: 'Raise a power to an exponent by multiplying exponents.',
          exampleQuestion: 'Simplify (3x⁴)³.',
          exampleSolution: 'Raise coefficient to power: 3³ = 27. Multiply exponents: (x⁴)³ = x⁴*³ = x¹². Result = 27x¹².',
          keywords: ['power of power', 'brackets exponents']
        },
        {
          id: 'exponent-negative-fractional',
          name: 'Negative & Fractional Exponents',
          math: 'x⁻ᵃ = 1 / xᵃ   |   xᵃ⁄ᵇ = ᵇ√(xᵃ)',
          description: 'Negative exponents invert to denominator. Fractional exponents represent roots.',
          exampleQuestion: 'Evaluate 16^(-3/4).',
          exampleSolution: '16^(-3/4) = 1 / (16^(3/4)) = 1 / (⁴√16)³ = 1 / (2)³ = 1/8.',
          keywords: ['negative exponent', 'fractional exponent', 'radicals', 'roots']
        }
      ]
    },
    {
      id: 'sec-quadratic',
      sectionNumber: 7,
      sectionTitle: 'Quadratic Equations & Parabolas',
      category: 'Algebra',
      description: 'Standard, vertex forms, roots, vertex, and discriminant properties.',
      formulas: [
        {
          id: 'quadratic-formula',
          name: 'Quadratic Formula',
          math: 'x = (-b ± √(b² - 4ac)) / (2a)',
          description: 'Solutions for any quadratic equation in standard form ax² + bx + c = 0.',
          exampleQuestion: 'Find the solutions of x² - 6x + 4 = 0 using the quadratic formula.',
          exampleSolution: 'x = (6 ± √((-6)² - 4(1)(4))) / 2 = (6 ± √(36 - 16)) / 2 = (6 ± √20) / 2 = (6 ± 2√5)/2 = 3 ± √5.',
          keywords: ['quadratic formula', 'roots', 'zeros', 'solutions']
        },
        {
          id: 'parabola-vertex',
          name: 'Parabola Vertex & Axis of Symmetry',
          math: 'x = -b / (2a)  |  Vertex Form: y = a(x - h)² + k',
          description: 'Vertex coordinate is (h, k). x = -b/(2a) gives axis of symmetry.',
          exampleQuestion: 'Find the coordinates of the vertex of the parabola f(x) = 2x² - 8x + 11.',
          exampleSolution: 'x_vertex = -b/(2a) = -(-8)/(2*2) = 8/4 = 2. f(2) = 2(2)² - 8(2) + 11 = 8 - 16 + 11 = 3. Vertex is (2, 3).',
          keywords: ['vertex', 'axis of symmetry', 'parabola', 'minimum', 'maximum']
        },
        {
          id: 'discriminant',
          name: 'The Discriminant',
          math: 'D = b² - 4ac',
          description: 'D > 0: Two real solutions. D = 0: One real solution. D < 0: No real solutions.',
          exampleQuestion: 'Determine the number of real solutions for 3x² + 5x + 4 = 0.',
          exampleSolution: 'D = b² - 4ac = 5² - 4(3)(4) = 25 - 48 = -23. Since D < 0, there are zero real solutions (two complex solutions).',
          keywords: ['discriminant', 'number of solutions', 'b squared minus 4ac']
        },
        {
          id: 'sum-product-roots',
          name: 'Sum and Product of Roots (Vieta)',
          math: 'Sum = -b / a   |   Product = c / a',
          description: 'Shortcut for finding root sums or products without fully solving.',
          exampleQuestion: 'Without solving, find the sum and product of the roots of 4x² - 12x - 7 = 0.',
          exampleSolution: 'Sum = -b/a = -(-12)/4 = 3. Product = c/a = -7/4.',
          keywords: ['sum of roots', 'product of roots', 'vieta']
        }
      ]
    },
    {
      id: 'sec-statistics',
      sectionNumber: 8,
      sectionTitle: 'Statistics & Data Analysis',
      category: 'Statistics',
      description: 'Measures of center, spread, and data distribution concepts tested on the SAT.',
      formulas: [
        {
          id: 'mean-formula',
          name: 'Arithmetic Mean (Average)',
          math: 'x̄ = (∑x) / n = (Sum of Values) / (Count)',
          description: 'Sum of all observations divided by the total number of observations.',
          exampleQuestion: 'Five quiz scores are 78, 84, 88, 90, and 95. What is the mean score?',
          exampleSolution: 'Sum = 78 + 84 + 88 + 90 + 95 = 435. Mean = 435 / 5 = 87.',
          keywords: ['mean', 'average', 'sum over count']
        },
        {
          id: 'median-range',
          name: 'Median and Range',
          math: 'Range = Maximum - Minimum',
          description: 'Median is middle value of ordered set. Range measures total spread.',
          exampleQuestion: 'Find the median and range of {14, 8, 22, 16, 11, 25, 18}.',
          exampleSolution: 'Order data: {8, 11, 14, 16, 18, 22, 25}. Median (middle) = 16. Range = Max - Min = 25 - 8 = 17.',
          keywords: ['median', 'range', 'spread', 'middle value']
        },
        {
          id: 'standard-deviation-concept',
          name: 'Standard Deviation (Spread)',
          math: 'Measures data dispersion around the mean',
          description: 'A dataset whose values are more clustered around the mean has a lower standard deviation.',
          exampleQuestion: 'Set A = {20, 20, 20, 20} and Set B = {10, 15, 25, 30}. Which set has a higher standard deviation?',
          exampleSolution: 'Set A has all identical values, so its standard deviation is 0. Set B values are spread out, so Set B has a much higher standard deviation.',
          keywords: ['standard deviation', 'spread', 'dispersion', 'normal distribution']
        }
      ]
    },
    {
      id: 'sec-probability',
      sectionNumber: 9,
      sectionTitle: 'Probability',
      category: 'Statistics',
      description: 'Basic probability, independent events, and conditional relationships.',
      formulas: [
        {
          id: 'probability-basic',
          name: 'Basic Probability',
          math: 'P(A) = (Number of Favorable Outcomes) / (Total Outcomes)',
          description: 'Probability of event A occurring where all outcomes are equally likely.',
          exampleQuestion: 'A box contains 6 red, 4 blue, and 10 white balls. A ball is drawn at random. What is the probability that it is red or blue?',
          exampleSolution: 'Total = 6 + 4 + 10 = 20. Favorable = 6 + 4 = 10. P = 10 / 20 = 1/2 = 0.50 (50%).',
          keywords: ['probability', 'outcomes', 'favorable', 'chance']
        },
        {
          id: 'probability-independent',
          name: 'Independent Events & Union',
          math: 'P(A and B) = P(A) · P(B) | P(A or B) = P(A) + P(B) - P(A and B)',
          description: 'Rules for multiplying independent probabilities and adding non-mutually exclusive events.',
          exampleQuestion: 'A fair coin is flipped and a standard 6-sided die is rolled. What is the probability of getting Heads and rolling a 5?',
          exampleSolution: 'Events are independent: P(Heads and 5) = P(Heads) * P(5) = (1/2) * (1/6) = 1/12.',
          keywords: ['independent events', 'and', 'or', 'union', 'intersection']
        }
      ]
    },
    {
      id: 'sec-additional-relationships',
      sectionNumber: 10,
      sectionTitle: 'Additional Mathematical Relationships',
      category: 'Trigonometry',
      description: 'Trigonometric ratios, complementary angle relations, and polygon angle rules.',
      formulas: [
        {
          id: 'trig-definitions',
          name: 'Trigonometric Ratios (SOH CAH TOA)',
          math: 'sin = Opp/Hyp | cos = Adj/Hyp | tan = Opp/Adj',
          description: 'Definitions of sine, cosine, and tangent in a right-angled triangle.',
          exampleQuestion: 'In right triangle ABC, angle C is 90°, AB = 15, and BC = 9. What is tan(A)?',
          exampleSolution: 'Hypotenuse = 15, opposite leg to A is BC = 9. Adjacent leg AC = √(15² - 9²) = √(225 - 81) = √144 = 12. tan(A) = Opp / Adj = 9 / 12 = 3/4 = 0.75.',
          keywords: ['trigonometry', 'sin', 'cos', 'tan', 'soh cah toa']
        },
        {
          id: 'complementary-angles',
          name: 'Complementary Angle Identity',
          math: 'sin(x°) = cos(90° - x°)',
          description: 'Very frequent SAT concept: the sine of an acute angle equals the cosine of its complement.',
          exampleQuestion: 'If cos(4x - 6)° = sin(3x + 12)°, what is the value of x?',
          exampleSolution: 'Complementary angles add to 90°: (4x - 6) + (3x + 12) = 90 => 7x + 6 = 90 => 7x = 84 => x = 12.',
          keywords: ['complementary', 'sin cos 90', 'identity']
        },
        {
          id: 'polygon-angles',
          name: 'Sum of Interior Angles of Polygon',
          math: 'Sum = (n - 2) · 180°',
          description: 'Where n is the number of sides of the convex polygon.',
          exampleQuestion: 'What is the measure of each interior angle in a regular pentagon (5 sides)?',
          exampleSolution: 'Total interior sum = (5 - 2) * 180° = 3 * 180° = 540°. Each interior angle in regular pentagon = 540° / 5 = 108°.',
          keywords: ['polygon', 'interior angles', 'sides', 'n minus 2']
        }
      ]
    }
  ];

  // Tool State Object
  const state = {
    calculatorOpen: false,
    referenceSheetOpen: false,
    calculatorMinimized: false,
    calculatorMaximized: false,
    referenceSheetMaximized: false,
    calculatorAllowed: true,
    referenceSheetAllowed: true,
    calculatorLoaded: false,
    activeCalcMode: 'graphing', // 'graphing' | 'scientific'
    activeCategory: 'ALL',
    searchQuery: '',
    bookmarkedFormulas: new Set(),
    listeners: []
  };

  // LocalStorage Key for Bookmarked Formulas
  const BOOKMARKS_KEY = 'satelite_formula_bookmarks';

  function loadBookmarks() {
    try {
      const saved = localStorage.getItem(BOOKMARKS_KEY);
      if (saved) {
        const arr = JSON.parse(saved);
        state.bookmarkedFormulas = new Set(arr);
      }
    } catch (e) {
      state.bookmarkedFormulas = new Set();
    }
  }

  function saveBookmarks() {
    try {
      const arr = Array.from(state.bookmarkedFormulas);
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(arr));
      window.dispatchEvent(new CustomEvent('satelite:bookmarks_updated', { detail: arr }));
    } catch (e) {}
  }

  class SatMathTools {
    constructor() {
      loadBookmarks();
      this.dom = {};
      this.initDom();
      this.bindEvents();
    }

    initDom() {
      // Remove any previous instance containers if any
      const existingFloating = document.getElementById('sat-floating-tools-wrap');
      if (existingFloating) existingFloating.remove();
      const existingCalc = document.getElementById('sat-calculator-drawer');
      if (existingCalc) existingCalc.remove();
      const existingRef = document.getElementById('sat-ref-drawer');
      if (existingRef) existingRef.remove();

      // 1. Create Floating Tool Buttons
      const floatingWrap = document.createElement('div');
      floatingWrap.id = 'sat-floating-tools-wrap';
      floatingWrap.className = 'sat-math-floating-trigger';
      floatingWrap.innerHTML = `
        <button id="sat-open-calc-btn" class="sat-tool-btn" aria-label="Open SAT Desmos calculator">
          <span class="sat-tool-btn-icon">🧮</span>
          <span>Calculator</span>
        </button>
        <button id="sat-open-ref-btn" class="sat-tool-btn" aria-label="Open SAT reference sheet">
          <span class="sat-tool-btn-icon">📐</span>
          <span>Reference</span>
        </button>
      `;
      document.body.appendChild(floatingWrap);

      // 2. Create Desmos Calculator Drawer
      const calcContainer = document.createElement('div');
      calcContainer.id = 'sat-calculator-drawer';
      calcContainer.className = 'sat-calculator-container';
      calcContainer.setAttribute('role', 'dialog');
      calcContainer.setAttribute('aria-label', 'Desmos Graphing Calculator');
      calcContainer.innerHTML = `
        <div class="sat-calc-header" id="sat-calc-drag-handle">
          <div class="sat-calc-title">
            <span style="font-size: 1.2rem;">🧮</span>
            <span>Desmos Calculator</span>
            <span class="sat-calc-tag">Official SAT</span>
          </div>
          <div class="sat-calc-controls">
            <button class="sat-control-btn" id="sat-calc-min-btn" title="Minimize to dock" aria-label="Minimize calculator">_</button>
            <button class="sat-control-btn" id="sat-calc-max-btn" title="Toggle Fullscreen" aria-label="Expand calculator">⤢</button>
            <button class="sat-control-btn close-btn" id="sat-calc-close-btn" title="Close Calculator (Esc)" aria-label="Close calculator">✕</button>
          </div>
        </div>

        <div class="sat-calc-mode-bar">
          <div class="sat-calc-modes">
            <button class="sat-calc-mode-pill active" data-mode="graphing" id="mode-graphing-btn">Graphing (SAT)</button>
            <button class="sat-calc-mode-pill" data-mode="scientific" id="mode-scientific-btn">Scientific</button>
          </div>
          <a href="https://www.desmos.com/testing/cb-sat/graphing" target="_blank" rel="noopener noreferrer" class="sat-calc-external-link" title="Open calculator in separate browser window">
            <span>External Window</span>
            <span>↗</span>
          </a>
        </div>

        <div class="sat-calc-body" id="sat-calc-viewport">
          <div class="sat-calc-loading-overlay" id="sat-calc-loader">
            <div class="sat-calc-spinner"></div>
            <div style="font-weight: 600; font-size: 0.95rem;">Loading Official SAT Desmos Calculator...</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">Digital SAT Suite Assessment Environment</div>
          </div>
          <iframe 
            id="sat-desmos-iframe" 
            class="sat-calc-iframe" 
            src="about:blank"
            title="Official Desmos SAT Calculator" 
            allow="clipboard-write"
          ></iframe>
        </div>
      `;
      document.body.appendChild(calcContainer);

      // 3. Create SAT Reference Sheet Drawer
      const refContainer = document.createElement('div');
      refContainer.id = 'sat-ref-drawer';
      refContainer.className = 'sat-ref-container';
      refContainer.setAttribute('role', 'dialog');
      refContainer.setAttribute('aria-label', 'SAT Math Reference Sheet');
      refContainer.innerHTML = `
        <div class="sat-ref-header">
          <div class="sat-ref-title">
            <span style="font-size: 1.25rem;">📐</span>
            <span>SAT Math Reference Sheet</span>
          </div>
          <div class="sat-calc-controls">
            <button class="sat-control-btn" id="sat-ref-expand-all-btn" title="Expand / Collapse all sections (Ko'tarish va yoyish)" style="width: auto; padding: 0 10px; font-size: 0.78rem;">⇕ Collapse All</button>
            <button class="sat-control-btn" id="sat-ref-max-btn" title="Toggle Fullscreen (To'liq ochish/Ko'tarish)" aria-label="Expand Reference Sheet">⤢</button>
            <button class="sat-control-btn close-btn" id="sat-ref-close-btn" title="Close Reference (Esc)" aria-label="Close reference sheet">✕</button>
          </div>
        </div>

        <div class="sat-ref-search-wrap">
          <div class="sat-ref-search-box">
            <span style="color: var(--text-muted); font-size: 0.95rem;">🔍</span>
            <input type="text" id="sat-ref-search-input" class="sat-ref-search-input" placeholder="Search formulas by name, concept, or symbol (e.g. circle, slope, vertex)..." aria-label="Search formulas">
            <button id="sat-ref-search-clear" style="display: none; background: none; border: none; color: var(--text-muted); cursor: pointer;">✕</button>
          </div>
        </div>

        <div class="sat-ref-filter-chips" id="sat-ref-categories">
          <button class="sat-ref-chip active" data-cat="ALL">All (10 Sections)</button>
          <button class="sat-ref-chip" data-cat="BOOKMARKS">★ Bookmarked (<span id="sat-bm-count">0</span>)</button>
          <button class="sat-ref-chip" data-cat="Geometry">Area & Volume</button>
          <button class="sat-ref-chip" data-cat="Circles">Circles</button>
          <button class="sat-ref-chip" data-cat="Triangles">Right Triangles</button>
          <button class="sat-ref-chip" data-cat="Algebra">Algebra & Coordinate</button>
          <button class="sat-ref-chip" data-cat="Statistics">Statistics & Probability</button>
        </div>

        <div class="sat-ref-body" id="sat-ref-formula-list">
          <!-- Rendered dynamically -->
        </div>
      `;
      document.body.appendChild(refContainer);

      // Cache elements
      this.dom = {
        floatingWrap,
        openCalcBtn: document.getElementById('sat-open-calc-btn'),
        openRefBtn: document.getElementById('sat-open-ref-btn'),
        calcContainer,
        calcLoader: document.getElementById('sat-calc-loader'),
        calcIframe: document.getElementById('sat-desmos-iframe'),
        calcMinBtn: document.getElementById('sat-calc-min-btn'),
        calcMaxBtn: document.getElementById('sat-calc-max-btn'),
        calcCloseBtn: document.getElementById('sat-calc-close-btn'),
        modeGraphingBtn: document.getElementById('mode-graphing-btn'),
        modeScientificBtn: document.getElementById('mode-scientific-btn'),
        refContainer,
        refMaxBtn: document.getElementById('sat-ref-max-btn'),
        refCloseBtn: document.getElementById('sat-ref-close-btn'),
        refSearchInput: document.getElementById('sat-ref-search-input'),
        refSearchClear: document.getElementById('sat-ref-search-clear'),
        refCategories: document.getElementById('sat-ref-categories'),
        refFormulaList: document.getElementById('sat-ref-formula-list'),
        bmCount: document.getElementById('sat-bm-count')
      };

      this.renderReferenceList();
      this.updateBookmarkCount();
    }

    bindEvents() {
      // Open / Close Buttons
      this.dom.openCalcBtn.addEventListener('click', () => {
        if (!state.calculatorAllowed) return;
        this.toggleCalculator();
      });

      this.dom.openRefBtn.addEventListener('click', () => {
        if (!state.referenceSheetAllowed) return;
        this.toggleReferenceSheet();
      });

      this.dom.calcCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeCalculator();
      });

      this.dom.refCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeReferenceSheet();
      });

      // Min / Max Controls
      this.dom.calcMinBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleCalculatorMinimize();
      });

      this.dom.calcContainer.addEventListener('click', (e) => {
        if (state.calculatorMinimized) {
          this.toggleCalculatorMinimize();
        }
      });

      this.dom.calcMaxBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleCalculatorMaximize();
      });

      this.dom.refMaxBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleReferenceSheetMaximize();
      });

      const expandAllBtn = document.getElementById('sat-ref-expand-all-btn');
      if (expandAllBtn) {
        expandAllBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const sections = document.querySelectorAll('.sat-formula-section');
          const anyClosed = Array.from(sections).some(s => !s.classList.contains('open'));
          sections.forEach(s => s.classList.toggle('open', anyClosed));
          expandAllBtn.textContent = anyClosed ? '⇕ Collapse All' : '⇕ Expand All';
        });
      }

      // Calc Mode Switching
      this.dom.modeGraphingBtn.addEventListener('click', () => {
        this.setCalcMode('graphing');
      });
      this.dom.modeScientificBtn.addEventListener('click', () => {
        this.setCalcMode('scientific');
      });

      // Iframe Load Event
      this.dom.calcIframe.addEventListener('load', () => {
        if (this.dom.calcIframe.src && this.dom.calcIframe.src !== 'about:blank') {
          setTimeout(() => {
            this.dom.calcLoader.style.display = 'none';
          }, 300);
        }
      });

      // Reference Sheet Search
      this.dom.refSearchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.trim().toLowerCase();
        this.dom.refSearchClear.style.display = state.searchQuery ? 'block' : 'none';
        this.renderReferenceList();
      });

      this.dom.refSearchClear.addEventListener('click', () => {
        this.dom.refSearchInput.value = '';
        state.searchQuery = '';
        this.dom.refSearchClear.style.display = 'none';
        this.renderReferenceList();
        this.dom.refSearchInput.focus();
      });

      // Category Chips
      this.dom.refCategories.addEventListener('click', (e) => {
        const chip = e.target.closest('.sat-ref-chip');
        if (!chip) return;
        this.dom.refCategories.querySelectorAll('.sat-ref-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.activeCategory = chip.dataset.cat;
        this.renderReferenceList();
      });

      // Global Keydown Handler: Escape closes active tool
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (state.calculatorOpen && !state.calculatorMinimized) {
            this.closeCalculator();
          } else if (state.referenceSheetOpen) {
            this.closeReferenceSheet();
          }
        }
      });
    }

    setPermissions(permissions = {}) {
      if (permissions.calculatorAllowed !== undefined) {
        state.calculatorAllowed = permissions.calculatorAllowed !== false;
      }
      if (permissions.referenceSheetAllowed !== undefined) {
        state.referenceSheetAllowed = permissions.referenceSheetAllowed !== false;
      }

      // Update UI visibility
      if (state.calculatorAllowed) {
        this.dom.openCalcBtn.classList.remove('sat-tool-disabled');
        this.dom.openCalcBtn.style.display = 'inline-flex';
      } else {
        this.dom.openCalcBtn.classList.add('sat-tool-disabled');
        this.dom.openCalcBtn.style.display = 'none';
        if (state.calculatorOpen) this.closeCalculator();
      }

      if (state.referenceSheetAllowed) {
        this.dom.openRefBtn.classList.remove('sat-tool-disabled');
        this.dom.openRefBtn.style.display = 'inline-flex';
      } else {
        this.dom.openRefBtn.classList.add('sat-tool-disabled');
        this.dom.openRefBtn.style.display = 'none';
        if (state.referenceSheetOpen) this.closeReferenceSheet();
      }

      // If both disabled, hide floating toolbar
      if (!state.calculatorAllowed && !state.referenceSheetAllowed) {
        this.dom.floatingWrap.style.display = 'none';
      } else {
        this.dom.floatingWrap.style.display = 'flex';
      }
    }

    toggleCalculator() {
      if (state.calculatorOpen) {
        this.closeCalculator();
      } else {
        this.openCalculator();
      }
    }

    openCalculator() {
      if (!state.calculatorAllowed) return;
      state.calculatorOpen = true;
      this.dom.calcContainer.classList.add('open');
      this.dom.openCalcBtn.classList.add('active');

      // Lazy load the Desmos iframe on first open
      if (!state.calculatorLoaded) {
        this.loadDesmos();
      }

      this.emitStateChange();
    }

    closeCalculator() {
      state.calculatorOpen = false;
      state.calculatorMinimized = false;
      this.dom.calcContainer.classList.remove('open', 'minimized', 'maximized');
      this.dom.openCalcBtn.classList.remove('active');
      this.emitStateChange();
    }

    toggleCalculatorMinimize() {
      state.calculatorMinimized = !state.calculatorMinimized;
      if (state.calculatorMinimized) {
        this.dom.calcContainer.classList.add('minimized');
      } else {
        this.dom.calcContainer.classList.remove('minimized');
      }
    }

    toggleCalculatorMaximize() {
      state.calculatorMaximized = !state.calculatorMaximized;
      if (state.calculatorMaximized) {
        this.dom.calcContainer.classList.add('maximized');
        this.dom.calcMaxBtn.textContent = '⤓';
      } else {
        this.dom.calcContainer.classList.remove('maximized');
        this.dom.calcMaxBtn.textContent = '⤢';
      }
    }

    setCalcMode(mode) {
      if (state.activeCalcMode === mode) return;
      state.activeCalcMode = mode;

      this.dom.modeGraphingBtn.classList.toggle('active', mode === 'graphing');
      this.dom.modeScientificBtn.classList.toggle('active', mode === 'scientific');

      this.dom.calcLoader.style.display = 'flex';
      if (mode === 'graphing') {
        this.dom.calcIframe.src = 'https://www.desmos.com/testing/cb-sat/graphing';
      } else {
        this.dom.calcIframe.src = 'https://www.desmos.com/scientific?embed';
      }
    }

    loadDesmos() {
      state.calculatorLoaded = true;
      this.dom.calcLoader.style.display = 'flex';
      // Official College Board Digital SAT Desmos Graphing Calculator URL
      this.dom.calcIframe.src = 'https://www.desmos.com/testing/cb-sat/graphing';
    }

    toggleReferenceSheet() {
      if (state.referenceSheetOpen) {
        this.closeReferenceSheet();
      } else {
        this.openReferenceSheet();
      }
    }

    openReferenceSheet(targetFormulaId = null) {
      if (!state.referenceSheetAllowed) return;
      state.referenceSheetOpen = true;
      this.dom.refContainer.classList.add('open');
      this.dom.openRefBtn.classList.add('active');

      if (targetFormulaId) {
        this.scrollToFormula(targetFormulaId);
      }

      this.emitStateChange();
    }

    closeReferenceSheet() {
      state.referenceSheetOpen = false;
      this.dom.refContainer.classList.remove('open', 'maximized');
      this.dom.openRefBtn.classList.remove('active');
      this.emitStateChange();
    }

    toggleReferenceSheetMaximize() {
      state.referenceSheetMaximized = !state.referenceSheetMaximized;
      if (state.referenceSheetMaximized) {
        this.dom.refContainer.classList.add('maximized');
        this.dom.refMaxBtn.textContent = '⤓';
      } else {
        this.dom.refContainer.classList.remove('maximized');
        this.dom.refMaxBtn.textContent = '⤢';
      }
    }

    scrollToFormula(formulaId) {
      setTimeout(() => {
        // Expand section if collapsed
        const card = document.getElementById(`sat-fcard-${formulaId}`);
        if (card) {
          const section = card.closest('.sat-formula-section');
          if (section) section.classList.add('open');
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.classList.add('highlighted');
          setTimeout(() => card.classList.remove('highlighted'), 2500);
        }
      }, 100);
    }

    renderReferenceList() {
      const container = this.dom.refFormulaList;
      const query = state.searchQuery;
      const category = state.activeCategory;

      let html = `
        <div class="sat-ref-official-notice">
          <span style="font-size: 1.2rem;">🏛️</span>
          <div>
            <strong>Official Digital SAT Math Reference Sheet</strong><br>
            Formulas and relationships specified in College Board Digital SAT guidelines. You do not need to memorize these formulas for test day.
          </div>
        </div>
      `;

      let matchesFound = 0;

      SAT_FORMULAS_DATA.forEach(sec => {
        // Filter by category
        if (category !== 'ALL' && category !== 'BOOKMARKS') {
          if (sec.category !== category) return;
        }

        // Filter formulas in this section by search query and bookmarks
        const filteredFormulas = sec.formulas.filter(f => {
          if (category === 'BOOKMARKS' && !state.bookmarkedFormulas.has(f.id)) {
            return false;
          }
          if (!query) return true;
          const haystack = `${f.name} ${f.math} ${f.description} ${f.keywords.join(' ')}`.toLowerCase();
          return haystack.includes(query);
        });

        if (filteredFormulas.length === 0) return;
        matchesFound += filteredFormulas.length;

        // Open all sections by default so students can immediately scroll up and down through all formulas and demo problems
        const isOpen = 'open';

        html += `
          <div class="sat-formula-section ${isOpen}" id="${sec.id}">
            <div class="sat-section-header" onclick="this.parentElement.classList.toggle('open')">
              <div class="sat-section-title-wrap">
                <span class="sat-section-num">${sec.sectionNumber}</span>
                <span class="sat-section-title">${sec.sectionTitle}</span>
              </div>
              <span class="sat-section-icon">▼</span>
            </div>
            <div class="sat-section-content">
              ${filteredFormulas.map(f => {
                const isBookmarked = state.bookmarkedFormulas.has(f.id);
                return `
                  <div class="sat-formula-card" id="sat-fcard-${f.id}">
                    <div class="sat-formula-top">
                      <span class="sat-formula-name">${f.name}</span>
                      <div class="sat-formula-actions">
                        <button class="sat-formula-btn" title="Copy Formula" onclick="SatMathTools.copyFormula('${escapeStr(f.math)}')">📋</button>
                        <button class="sat-formula-btn ${isBookmarked ? 'bookmarked' : ''}" title="Bookmark Formula" onclick="SatMathTools.toggleBookmark('${f.id}')">
                          ${isBookmarked ? '★' : '☆'}
                        </button>
                      </div>
                    </div>
                    <div class="sat-formula-math">${f.math}</div>
                    <div class="sat-formula-desc">${f.description}</div>
                    ${f.exampleQuestion ? `
                      <details class="sat-formula-demo">
                        <summary class="sat-demo-summary">💡 Demo Problem & Solution</summary>
                        <div class="sat-demo-body">
                          <div class="sat-demo-question"><strong>Example:</strong> ${escapeHtml(f.exampleQuestion)}</div>
                          <div class="sat-demo-solution"><strong>Step-by-step:</strong> ${escapeHtml(f.exampleSolution)}</div>
                        </div>
                      </details>
                    ` : ''}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      });

      if (matchesFound === 0) {
        html += `
          <div style="text-align: center; padding: 48px 16px; color: var(--text-muted);">
            <div style="font-size: 2.2rem; margin-bottom: 12px;">🔍</div>
            <h4 style="font-size: 1.1rem; color: var(--text-primary); margin-bottom: 6px;">No Formulas Found</h4>
            <p style="font-size: 0.88rem;">No matching SAT formulas for "<strong>${escapeHtml(query || category)}</strong>". Try searching for "circle", "slope", "triangle", or "area".</p>
          </div>
        `;
      }

      container.innerHTML = html;
    }

    toggleBookmark(formulaId) {
      if (state.bookmarkedFormulas.has(formulaId)) {
        state.bookmarkedFormulas.delete(formulaId);
        if (window.Toast) Toast.info('Formula removed from your bookmarks.');
      } else {
        state.bookmarkedFormulas.add(formulaId);
        if (window.Toast) Toast.success('Formula saved to your Study Tools bookmarks!');
      }
      saveBookmarks();
      this.updateBookmarkCount();
      this.renderReferenceList();
    }

    updateBookmarkCount() {
      if (this.dom.bmCount) {
        this.dom.bmCount.textContent = state.bookmarkedFormulas.size;
      }
    }

    copyFormula(mathStr) {
      navigator.clipboard.writeText(mathStr).then(() => {
        if (window.Toast) Toast.success(`Copied: ${mathStr}`);
      }).catch(() => {
        if (window.Toast) Toast.info(`Formula: ${mathStr}`);
      });
    }

    getBookmarks() {
      const result = [];
      SAT_FORMULAS_DATA.forEach(sec => {
        sec.formulas.forEach(f => {
          if (state.bookmarkedFormulas.has(f.id)) {
            result.push({ ...f, section: sec.sectionTitle, category: sec.category });
          }
        });
      });
      return result;
    }

    emitStateChange() {
      const payload = {
        calculatorOpen: state.calculatorOpen,
        referenceSheetOpen: state.referenceSheetOpen,
        calculatorMinimized: state.calculatorMinimized,
        calculatorMaximized: state.calculatorMaximized
      };
      state.listeners.forEach(fn => fn(payload));
      window.dispatchEvent(new CustomEvent('satelite:tools_state_change', { detail: payload }));
    }

    onStateChange(fn) {
      state.listeners.push(fn);
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[m]);
  }

  function escapeStr(str) {
    if (!str) return '';
    return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
  }

  // Initialize and mount singleton on window
  document.addEventListener('DOMContentLoaded', () => {
    window.SatMathTools = new SatMathTools();
  });

  // Also expose constructor
  window.SatMathToolsClass = SatMathTools;
})();
