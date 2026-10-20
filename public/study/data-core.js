window.STUDY_META = {
  module: "MEEN41330",
  title: "Data Analytics for Engineers",
  testName: "Test 1",
  testDate: "2026-10-22T14:00:00+01:00",
  location: "Room 234, Engineering building",
  weight: "20%",
  duration: 40,
  format: "10 MCQs + 5 short answers",
  scope: "EDA, Regression and Prediction, Classification, Statistical Machine Learning",
  rules: [
    "No external resources and no calculator.",
    "No coding. The test is theory, concepts and simple hand calculations.",
    "Show your work in Part 2 for partial credit.",
    "Sign and submit the first page.",
    "Answers go in the spaces marked Write Your Answers Here."
  ],
  lecturerQuote: "Will there be coding? No. Is it just theory and concept? Yes. Will there be calculations? Yes, but no calculator is allowed. You are only expected to do simple calculations by hand.",
  caveat: "The lecturer's 7 and 12 October emails limit Test 1 to Statistical ML. Data and Sampling Distributions is not in the stated scope, even though it was taught on Monday 19 October. Check Brightspace on Thursday morning in case that changes."
};

window.STUDY_TOPICS = [
  {
    id: "eda",
    name: "Exploratory Data Analysis",
    short: "EDA",
    accent: "#8b7cff",
    soft: "rgba(139,124,255,0.14)",
    blurb: "Types of data, location, spread, charts and correlation. The vocabulary questions are easy marks.",
    lessons: [
      {
        id: "eda-1",
        title: "Data types and rectangular data",
        minutes: 4,
        body: "Every data set starts with two questions: what is a row and what is a column? In rectangular data, each row is a record or observation, and each column is a feature, variable or input. One column is usually the outcome, response or label.\n\nNumeric variables can be continuous, such as height, or discrete, such as number of children. Categorical variables can be binary, such as yes or no, nominal, such as eye colour, or ordinal, such as letter grades.\n\nThe type of variable decides which summary and chart make sense. You do not compute a mean for eye colour, and you do not treat a binary outcome as a continuous measurement without thinking about what the numbers mean.",
        keyPoints: [
          "Rows are records. Columns are features or variables.",
          "The outcome is also called the response, dependent variable or label.",
          "Numeric: continuous or discrete. Categorical: binary, nominal or ordinal.",
          "Variable type drives the choice of summary statistic and chart."
        ],
        example: "Iris: each row is a flower, each column is a measurement or the species. Species is categorical. The four measurements are continuous numeric."
      },
      {
        id: "eda-2",
        title: "Location: mean, median, trimmed and weighted",
        minutes: 5,
        body: "The mean is the sum divided by the count. It uses every value, so a single extreme value can pull it a long way. The median is the middle value after sorting, so it is robust to outliers and skew.\n\nA trimmed mean drops a fixed number of the smallest and largest values, then averages the rest. A weighted mean multiplies each value by a weight, then divides by the sum of the weights. Expected value is a weighted mean where the weights are probabilities.\n\nWhen the distribution is roughly symmetric, the mean and median are close. When it is skewed, report the median and the interquartile range.",
        keyPoints: [
          "Mean is sensitive to outliers. Median is robust.",
          "Trimmed mean drops extremes before averaging.",
          "Weighted mean uses user-specified weights.",
          "Expected value is a weighted mean with probabilities.",
          "For skewed data, median and IQR are safer summaries."
        ],
        example: "Salaries: 30k, 35k, 40k, 45k and 1m. The mean is 230k, but the median is 40k. The median describes a typical salary better."
      },
      {
        id: "eda-3",
        title: "Variability and percentiles",
        minutes: 5,
        body: "Location alone is not enough. Two data sets can have the same mean but very different spread.\n\nA deviation is a value minus the mean. Mean absolute deviation averages the absolute deviations. Variance averages the squared deviations, using n minus 1 in the denominator for a sample. Standard deviation is the square root of variance, so it is in the same units as the data.\n\nA percentile is the value below which a given percentage of the data lies. The interquartile range is Q3 minus Q1 and covers the middle 50 percent. A boxplot shows the median, Q1, Q3, whiskers and possible outliers.",
        keyPoints: [
          "Variance uses squared deviations and divides by n minus 1 for a sample.",
          "Standard deviation is in the original units. Variance is in squared units.",
          "IQR = Q3 minus Q1. It is robust to outliers.",
          "Range = maximum minus minimum. It is not robust.",
          "A boxplot shows median, quartiles, whiskers and outliers."
        ],
        example: "Q1 = 18 and Q3 = 42, so IQR = 24. The middle 50 percent of the data spans 24 units."
      },
      {
        id: "eda-4",
        title: "Distributions and charts",
        minutes: 5,
        body: "A frequency table counts how many values fall in each bin or category. A histogram plots those counts for numeric data. A density plot is a smoothed histogram. A bar chart compares categories.\n\nA contingency table counts combinations of two categorical variables. A scatterplot shows two numeric variables. When there are too many points, hexagonal binning or a contour plot reduces overplotting. A violin plot shows the distribution of a numeric variable within categories.\n\nGood charts have a clear title, labelled axes, sensible scales, a legend when needed and a caption that explains the point. Bad charts hide the scale, use inconsistent axes, overload colour, use 3D for no reason, or make a claim the data cannot support.",
        keyPoints: [
          "Histogram or density: one numeric variable.",
          "Bar chart: one categorical variable.",
          "Contingency table: two categorical variables.",
          "Scatterplot: two numeric variables.",
          "Hexbin or contour: many numeric points with overplotting.",
          "Violin plot: distribution of a numeric variable by group."
        ],
        example: "Two numeric variables with 50,000 points are better shown with a hexbin or contour plot than a scatterplot where every point overlaps."
      },
      {
        id: "eda-5",
        title: "Correlation",
        minutes: 4,
        body: "The Pearson correlation coefficient measures the strength and direction of a linear relationship. It runs from minus 1 to plus 1. A value of 0 means no linear association, not necessarily no relationship at all.\n\nThe coefficient is sensitive to outliers. Spearman correlation uses ranks, so it captures monotonic association and is less affected by extreme values. A correlation matrix shows pairwise correlations, often as a heatmap.\n\nCorrelation does not imply causation. A third variable can drive both. Ice cream sales and drowning incidents rise together, but heat is the confounder.",
        keyPoints: [
          "Pearson r runs from minus 1 to plus 1 and measures linear association.",
          "r = 0 means no linear association, not no relationship.",
          "Correlation is sensitive to outliers. Spearman is rank based and more robust.",
          "A correlation matrix shows pairwise relationships.",
          "Correlation does not imply causation."
        ],
        example: "A correlation of minus 0.9 is a strong negative linear relationship: as one variable rises, the other tends to fall."
      },
      {
        id: "eda-6",
        title: "EDA exam traps",
        minutes: 3,
        body: "The common traps are predictable. The mean is reported for skewed data. A correlation of zero is read as no relationship. The range is used as a robust measure. A histogram is chosen for a categorical variable. A scatterplot is used when there are too many points. A chart is judged without looking at the axes.\n\nSlow down on the wording. If a question says robust, think median, IQR or trimmed mean. If it says linear association, think Pearson. If it says two categorical variables, think contingency table. If it says individual prediction versus mean response, think prediction interval versus confidence interval.",
        keyPoints: [
          "Robust: median, IQR, trimmed mean.",
          "Linear association: Pearson. Monotonic association: Spearman.",
          "Two categorical variables: contingency table.",
          "Many numeric points: hexbin or contour.",
          "Always read the axes and caption of a chart."
        ],
        example: "A question asks for a typical salary in a data set with one billionaire. The median is the answer, not the mean."
      }
    ]
  },
  {
    id: "reg",
    name: "Regression and Prediction",
    short: "REG",
    accent: "#38d9c9",
    soft: "rgba(56,217,201,0.14)",
    blurb: "Fit a line, read the output, judge the model and avoid the classic interpretation mistakes.",
    lessons: [
      {
        id: "reg-1",
        title: "Simple linear regression",
        minutes: 5,
        body: "Simple linear regression models a numeric outcome Y as a straight line in one predictor X: Y = b0 + b1X.\n\nb0 is the intercept, the predicted value of Y when X is 0. b1 is the slope, the predicted change in Y for a one unit increase in X. The response is also called the dependent variable. The predictor is also called the independent variable.\n\nThe fitted value is the prediction for an observed X. The residual is the observed Y minus the fitted value. The residual sum of squares is the sum of squared residuals. Least squares chooses the line that makes RSS as small as possible.\n\nFrom summary statistics, the slope is r times s_y divided by s_x. The intercept is y bar minus the slope times x bar.",
        keyPoints: [
          "Y = b0 + b1X.",
          "b0 is predicted Y when X = 0.",
          "b1 is the predicted change in Y per one unit increase in X.",
          "Residual = observed Y minus fitted Y.",
          "Least squares minimises the residual sum of squares.",
          "b1 = r times s_y divided by s_x. b0 = y bar minus b1 times x bar."
        ],
        example: "Salary = 30,000 + 2,000 times years of experience. The intercept is the predicted salary at zero experience. The slope says salary rises by 2,000 euro per extra year."
      },
      {
        id: "reg-2",
        title: "Multiple regression and interpretation",
        minutes: 5,
        body: "Multiple linear regression extends the line to several predictors: Y = b0 + b1X1 + ... + bnXn.\n\nEach coefficient is the predicted change in Y for a one unit increase in that predictor, holding the other predictors constant. This holding constant clause is the part students forget.\n\nWhen predictors are correlated, coefficients can become unstable and hard to interpret. This is multicollinearity. It can come from including two near identical variables or from including all dummy variables instead of all but one. It is mainly a problem for interpretation, less so for prediction.\n\nCorrelation between predictors is common. For example, larger houses tend to have more bedrooms. The size drives the value, and the bedroom count may add little once size is in the model.",
        keyPoints: [
          "Each coefficient is the effect of one predictor holding the others constant.",
          "Multicollinearity means predictors are highly correlated.",
          "It makes coefficients unstable and hard to interpret.",
          "It is less damaging for prediction than for explanation.",
          "Drop redundant variables or use penalised regression."
        ],
        example: "House price = b0 + b1 times size + b2 times bedrooms. b1 is the effect of one extra square metre while holding bedrooms constant."
      },
      {
        id: "reg-3",
        title: "Model assessment: R squared, RMSE and AIC",
        minutes: 6,
        body: "R squared is the proportion of variance in Y explained by the model: 1 minus RSS divided by TSS. In sample it runs from 0 to 1. Higher is better, but it always increases when you add a variable, even a useless one.\n\nAdjusted R squared penalises extra variables. Use it when comparing models with different numbers of predictors.\n\nRMSE is the square root of the mean squared error. It is in the units of Y and tells you the typical size of a prediction error. Lower is better.\n\nAIC balances fit against complexity: 2P plus n times the natural log of RSS divided by n. Lower AIC is better. It rewards a good fit but penalises too many parameters.\n\nA t statistic is a coefficient divided by its standard error. It tests whether the coefficient is different from zero. A small p value is evidence against the null hypothesis that the coefficient is zero.",
        keyPoints: [
          "R squared: proportion of variance explained. It always rises when variables are added.",
          "Adjusted R squared: penalises extra variables.",
          "RMSE: typical prediction error in the units of Y. Lower is better.",
          "AIC: fit minus a complexity penalty. Lower is better.",
          "t = coefficient divided by standard error. Small p value means evidence against the null."
        ],
        example: "R squared = 0.64 means 64 percent of the variation in salary is explained by the model. RMSE = 8,000 euro means typical errors are around 8,000 euro."
      },
      {
        id: "reg-4",
        title: "Cross-validation and variable selection",
        minutes: 5,
        body: "Cross-validation estimates out of sample performance. Split the data into k folds. Train on k minus 1 folds and validate on the held out fold. Repeat until every fold has been used for validation. This is also called rotation estimation or out of sample testing.\n\nVariable selection methods include backward elimination, forward selection and all subset regression. They search for a good set of predictors. Stepwise methods are in sample methods, so their apparent performance can be optimistic. Validate them with cross-validation.\n\nRidge and lasso are penalised regression methods. Instead of including or dropping variables, they shrink coefficients. Ridge shrinks towards zero. Lasso can shrink some coefficients all the way to zero, so it also selects variables.\n\nAdjusted R squared and AIC are common selection criteria. More variables usually reduce RMSE and raise R squared, so use a criterion that penalises complexity.",
        keyPoints: [
          "k-fold cross-validation: train on k minus 1 folds, validate on the held out fold.",
          "It estimates out of sample performance and helps tune models.",
          "Stepwise and all subset selection are in sample methods.",
          "Ridge shrinks coefficients. Lasso can set some to zero.",
          "Use adjusted R squared or AIC to penalise complexity."
        ],
        example: "A model with 12 predictors has a slightly higher R squared than a model with 4. Adjusted R squared and AIC help decide whether the extra variables earn their place."
      },
      {
        id: "reg-5",
        title: "Prediction and categorical predictors",
        minutes: 5,
        body: "Extrapolation is prediction outside the range of the data used to fit the model. It is risky because the relationship may change outside the observed range.\n\nA confidence interval is an uncertainty interval around the mean response for a given X. A prediction interval is an uncertainty interval around an individual prediction. The prediction interval is wider because it includes the extra variability of one observation.\n\nCategorical predictors are encoded as dummy variables. A factor with P categories becomes P minus 1 binary columns. One category is the baseline and is represented by all zeros. Including all P dummies creates perfect multicollinearity, the dummy variable trap.\n\nOrdered factors, such as letter grades, can sometimes be treated as numeric if the order and spacing are meaningful. Be careful: the step from A to B may not be the same as B to C.",
        keyPoints: [
          "Extrapolation is prediction beyond the observed range. Use caution.",
          "Confidence interval: mean response. Prediction interval: individual value. Prediction interval is wider.",
          "P categories need P minus 1 dummy variables.",
          "Drop one category as the baseline to avoid the dummy variable trap.",
          "Ordered factors can be numeric only if the spacing is meaningful."
        ],
        example: "A house price model trained on houses from 100 to 300 square metres should not be trusted for a 1,000 square metre house without extra evidence."
      },
      {
        id: "reg-6",
        title: "Diagnostics and extensions",
        minutes: 4,
        body: "Regression diagnostics check whether the model is reasonable. Outliers are records far from the rest of the data or far from the fitted line. They can be detected with standardised residuals.\n\nAn omitted confounding variable influences both the predictor and the outcome, so the apparent relationship is distorted. Heteroskedasticity means the variance of the residuals is not constant. It can make standard errors and tests unreliable.\n\nPolynomial regression adds squared or higher powers of a predictor. Spline regression joins polynomial segments smoothly. Both add flexibility, but more flexibility means more risk of overfitting.",
        keyPoints: [
          "Outliers: large standardised residuals or unusual predictor values.",
          "Confounding: a third variable influences both X and Y.",
          "Heteroskedasticity: non constant residual variance.",
          "Polynomial and spline regression add flexibility.",
          "More flexibility can overfit. Validate with cross-validation."
        ],
        example: "A model of exam performance that omits study time may attribute too much to attendance, because students who attend also tend to study more."
      },
      {
        id: "reg-7",
        title: "Regression exam traps",
        minutes: 3,
        body: "The classic traps are interpretation errors. Students say the slope is the value of Y when X is 0, which is the intercept. They say R squared is accuracy. They compare R squared across models with different numbers of predictors without adjusting. They forget that a prediction interval is wider than a confidence interval. They include all P dummies for a factor with P categories. They treat correlation between predictors as harmless for interpretation.\n\nIf a question gives a regression equation, read it slowly. Intercept: predicted Y at X = 0. Slope: change in Y per unit X. R squared: share of variance explained. RMSE: typical error in Y units. If the question says holding other variables constant, it is a multiple regression interpretation.",
        keyPoints: [
          "b0 is the intercept, not the slope.",
          "R squared is not accuracy.",
          "Adjusted R squared is for comparing models with different numbers of predictors.",
          "Prediction interval is wider than confidence interval.",
          "P categories need P minus 1 dummies.",
          "Holding others constant is multiple regression language."
        ],
        example: "A slope of 3.5 does not mean Y is 3.5 when X is 0. It means Y changes by 3.5 on average per one unit increase in X."
      }
    ]
  },
  {
    id: "cls",
    name: "Classification",
    short: "CLS",
    accent: "#ffb86b",
    soft: "rgba(255,184,107,0.14)",
    blurb: "Logistic regression, confusion matrices, ROC and the precision recall trade-off. Heavy on interpretation.",
    lessons: [
      {
        id: "cls-1",
        title: "Classification basics and LDA",
        minutes: 5,
        body: "Classification is supervised learning. You train on labelled data where the outcome is known, then apply the model to new data where the outcome is unknown.\n\nBinary classification has two classes. Multi class classification has more than two classes, and each record gets exactly one. Multi label classification allows more than one label per record.\n\nA discriminant function maximises the separation between classes. Linear discriminant analysis, LDA, finds a linear combination of predictors that maximises the ratio of between group variation to within group variation. Predictors should be standardised before comparing LDA weights.\n\nLDA is a linear classifier. It is related to logistic regression, but it approaches the problem through class distributions rather than directly modelling the probability of the outcome.",
        keyPoints: [
          "Classification is supervised learning on labelled data.",
          "Binary: two classes. Multi class: more than two, one label each. Multi label: more than one label possible.",
          "A discriminant function maximises separation between classes.",
          "LDA maximises between group variation relative to within group variation.",
          "Standardise predictors before interpreting LDA weights."
        ],
        example: "Predicting whether an email is spam or not is binary classification. Predicting whether a photo contains a dog, a cat and a person is multi label."
      },
      {
        id: "cls-2",
        title: "Logistic regression",
        minutes: 6,
        body: "Logistic regression is a generalised linear model for a binary outcome. It models the log odds of the positive class as a linear function of the predictors:\n\nlog(p divided by 1 minus p) = b0 + b1X1 + ... + bnXn.\n\nThe probability is p = 1 divided by (1 + e to the power of minus the linear predictor). The output is between 0 and 1. A threshold, usually 0.5, turns the probability into a class.\n\nA coefficient is a change in log odds for a one unit increase in the predictor, holding the others constant. The odds ratio is e to the power of the coefficient. An odds ratio above 1 means higher odds of the positive class.\n\nLogistic regression is fitted by maximum likelihood estimation, MLE. It has no closed form solution, so the fitting is iterative. Linear regression is fitted by least squares, but logistic regression is not.",
        keyPoints: [
          "Logistic regression models the log odds of the positive class.",
          "p = 1 divided by (1 + e to the power of minus the linear predictor).",
          "A coefficient is a change in log odds. The odds ratio is e to the power of the coefficient.",
          "Fitted by maximum likelihood estimation, not least squares.",
          "A threshold turns the probability into a class."
        ],
        example: "If a coefficient is 0.7, the odds ratio is e to the power of 0.7, about 2.0. A one unit increase in that predictor roughly doubles the odds of the positive class."
      },
      {
        id: "cls-3",
        title: "Confusion matrix and metrics",
        minutes: 6,
        body: "A confusion matrix counts four outcomes: true positives, true negatives, false positives and false negatives.\n\nAccuracy is the share of all predictions that are correct: TP plus TN divided by the total. It is easy to read but misleading when classes are imbalanced.\n\nPrecision is TP divided by TP plus FP. Of the cases the model called positive, how many really were positive? Recall, also called sensitivity, is TP divided by TP plus FN. Of the real positives, how many did the model catch? Specificity is TN divided by TN plus FP. Of the real negatives, how many did the model correctly clear?\n\nThe F1 score is the harmonic mean of precision and recall: 2 times precision times recall divided by precision plus recall. It balances the two when you care about both.",
        keyPoints: [
          "Accuracy = (TP + TN) divided by total.",
          "Precision = TP divided by (TP + FP).",
          "Recall or sensitivity = TP divided by (TP + FN).",
          "Specificity = TN divided by (TN + FP).",
          "F1 = 2 times precision times recall divided by (precision + recall)."
        ],
        example: "TP = 40, FP = 10, FN = 20, TN = 30. Accuracy = 70/100 = 0.70. Precision = 40/50 = 0.80. Recall = 40/60 = 0.667. Specificity = 30/40 = 0.75."
      },
      {
        id: "cls-4",
        title: "Thresholds, ROC and AUC",
        minutes: 5,
        body: "A classifier usually outputs a probability. A threshold turns that probability into a class. At a threshold of 0.5, probabilities above 0.5 become positive.\n\nLowering the threshold makes it easier to predict positive. Recall usually rises because more real positives are caught, but precision usually falls because more false positives are included. Raising the threshold does the opposite.\n\nThe ROC curve plots the true positive rate, which is recall, against the false positive rate, which is 1 minus specificity, at different thresholds. A model that is good at separating the classes has a curve that bows towards the top left.\n\nAUC is the area under the ROC curve. AUC 0.5 is random guessing. AUC 1 is perfect separation. AUC is threshold independent, which is useful for comparing models before choosing an operating threshold.",
        keyPoints: [
          "Threshold turns a probability into a class.",
          "Lower threshold: recall up, precision usually down.",
          "Higher threshold: precision usually up, recall down.",
          "ROC plots true positive rate against false positive rate.",
          "AUC 0.5 is random. AUC 1 is perfect."
        ],
        example: "If missing a positive case is costly, lower the threshold to raise recall, then check how much precision you lose."
      },
      {
        id: "cls-5",
        title: "Imbalanced data",
        minutes: 4,
        body: "Imbalanced data means one class is much rarer than the other. Accuracy becomes misleading because a model that always predicts the majority class can look very accurate while catching none of the minority class.\n\nUse precision, recall, F1, specificity and AUC. Choose the metric that matches the cost of errors. If false negatives are expensive, focus on recall. If false positives are expensive, focus on precision.\n\nUndersampling uses fewer majority class records. Oversampling draws more minority records, either by duplication or by generating new ones. SMOTE creates synthetic minority records by interpolating between existing minority records. It can improve robustness, but the synthetic records are not real data and should be used with care.",
        keyPoints: [
          "Accuracy is misleading when classes are imbalanced.",
          "Use precision, recall, F1, specificity and AUC.",
          "Undersampling reduces the majority class.",
          "Oversampling increases the minority class.",
          "SMOTE creates synthetic minority records, not real ones."
        ],
        example: "With 95 percent negatives, a model that always predicts negative gets 95 percent accuracy but zero recall for the positive class."
      },
      {
        id: "cls-6",
        title: "Classification exam traps",
        minutes: 3,
        body: "The traps are mostly definitions. Students confuse precision and recall. They compute accuracy when the question is about imbalanced data. They say logistic regression is fitted by least squares. They interpret a logistic coefficient as a probability change. They think AUC depends on the threshold. They forget that lowering the threshold trades precision for recall.\n\nIf a question gives a confusion matrix, write the four cells first: TP, FP, FN, TN. Then write the formula you need before substituting. If a question asks which metric to use, anchor it in the cost of errors: false negatives versus false positives.",
        keyPoints: [
          "Precision: of predicted positives, how many were real.",
          "Recall: of real positives, how many were caught.",
          "Logistic regression uses MLE, not least squares.",
          "A logistic coefficient changes log odds, not probability.",
          "AUC is threshold independent.",
          "Lower threshold trades precision for recall."
        ],
        example: "A cancer screening test cares more about false negatives, so recall is the key metric, with precision as a secondary check."
      }
    ]
  },
  {
    id: "ml",
    name: "Statistical Machine Learning",
    short: "ML",
    accent: "#b6f09c",
    soft: "rgba(182,240,156,0.14)",
    blurb: "KNN, trees, random forests and boosting. Learn the mechanics, the impurity maths and the evaluation traps.",
    lessons: [
      {
        id: "ml-1",
        title: "K nearest neighbours",
        minutes: 6,
        body: "K nearest neighbours, KNN, is a non parametric method. It does not fit a global equation. To predict a new record, it finds the K training records that are closest in feature space.\n\nFor classification, it takes the majority class among those K neighbours. For regression, it averages their outputs. KNN needs numeric input. Categorical variables must be encoded, often with one hot encoding.\n\nDistance matters. Euclidean distance is the square root of the sum of squared differences. Manhattan distance is the sum of absolute differences. Because distance is scale dependent, standardise features first. Otherwise a feature measured in euro can dominate a feature measured in years.\n\nK controls flexibility. K = 1 fits very locally and can overfit with high variance. Very large K oversmooths and can underfit with high bias. Typical K is 1 to 20. Odd K is often used in binary classification to avoid ties. Choose K with cross-validation and model metrics.",
        keyPoints: [
          "KNN is non parametric. It predicts from the K nearest records.",
          "Classification: majority class. Regression: average output.",
          "Requires numeric input. One hot encode categorical variables.",
          "Standardise features because distance is scale dependent.",
          "K = 1 overfits. Very large K underfits. Use cross-validation to choose K.",
          "Odd K avoids ties in binary classification."
        ],
        example: "With income in euro and age in years, raw Euclidean distance is dominated by income. Standardise both features before using KNN."
      },
      {
        id: "ml-2",
        title: "Decision trees and impurity",
        minutes: 7,
        body: "Decision trees, also called CART or Classification and Regression Trees, split the data recursively into more homogeneous nodes. Each split sends records left or right based on a threshold on one variable. A leaf node has no further splits.\n\nGini impurity for two classes is pA times 1 minus pA plus pB times 1 minus pB. It equals 1 minus the sum of squared class probabilities. A pure node has Gini 0. A 50 50 node has Gini 0.5.\n\nEntropy is minus the sum of p log base 2 p. A pure node has entropy 0. A 50 50 node has entropy 1.\n\nTo choose a split, compare the parent impurity with the weighted average of the child impurities. The Gini gain is parent impurity minus the weighted child impurity. The best split has the largest gain, or the lowest weighted child impurity.\n\nTrees can overfit if grown without control. Limit the depth, require a minimum number of samples to split or to be in a leaf, limit the number of leaf nodes, or prune with a complexity parameter. Tune these with cross-validation or grid search.",
        keyPoints: [
          "CART splits data recursively into more homogeneous nodes.",
          "Gini = 1 minus sum of squared class probabilities. Pure = 0, 50 50 = 0.5.",
          "Entropy = minus sum of p log2 p. Pure = 0, 50 50 = 1.",
          "Gini gain = parent impurity minus weighted child impurity.",
          "Control overfitting with depth, minimum samples, leaf limits or pruning.",
          "A leaf node has no further splits."
        ],
        example: "A node with 6 class A and 4 class B has pA = 0.6 and pB = 0.4. Gini = 0.6 times 0.4 plus 0.4 times 0.6 = 0.48."
      },
      {
        id: "ml-3",
        title: "Bagging and random forests",
        minutes: 6,
        body: "Bagging is bootstrap aggregating. Take bootstrap resamples of the data, fit a model on each resample, then average the predictions. Bagging reduces variance and is useful for unstable models such as deep trees.\n\nA random forest is bagging with decision trees, plus an extra twist: at each split, only a random subset of variables is considered. This decorrelates the trees, which makes the average better than averaging highly similar trees. For classification, the forest votes. For regression, it averages.\n\nEach bootstrap sample leaves out about one third of the records. Those are the out of bag records. Predict them with the trees that did not see them, and you get the out of bag error, OOB error. It is a built in estimate of test error.\n\nA random forest is a black box compared with a single tree. It can still overfit, but it is usually more accurate. It provides variable importance, often as mean decrease in accuracy or mean decrease in node impurity. Hyperparameters include the number of trees, the number of variables tried at each split, the minimum leaf size and the maximum number of nodes. Tune them with cross-validation.",
        keyPoints: [
          "Bagging: bootstrap resamples, fit, average. Reduces variance.",
          "Random forest: bagging plus a random subset of variables at each split.",
          "Classification votes. Regression averages.",
          "OOB error uses records left out of each bootstrap sample.",
          "Variable importance: mean decrease in accuracy or node impurity.",
          "Random forest is a black box and can still overfit."
        ],
        example: "A single deep tree may change a lot if one training record changes. A forest averages many trees, so the prediction is more stable."
      },
      {
        id: "ml-4",
        title: "Boosting",
        minutes: 4,
        body: "Boosting fits a series of models in sequence. Each new model puts more weight on the records that the previous models got wrong. The final prediction combines the sequence.\n\nCommon boosting algorithms are AdaBoost, gradient boosting and stochastic gradient boosting. Boosting mainly reduces bias, while bagging mainly reduces variance. It can overfit if you run too many rounds or use weak controls.\n\nIn practice, boosting is powerful on tabular data, but it needs careful tuning of learning rate, number of rounds and tree depth. Use a validation set or cross-validation to decide when to stop.",
        keyPoints: [
          "Boosting fits models sequentially, focusing on previous errors.",
          "AdaBoost, gradient boosting and stochastic gradient boosting are examples.",
          "Boosting mainly reduces bias. Bagging mainly reduces variance.",
          "It can overfit if run too long.",
          "Tune learning rate, rounds and tree depth with validation."
        ],
        example: "A gradient boosted model adds small trees one at a time, each correcting some of the remaining error."
      },
      {
        id: "ml-5",
        title: "Model evaluation and pitfalls",
        minutes: 5,
        body: "Use a training set to fit, a validation set to tune, and a test set to estimate final performance. Do not tune on the test set. Do not look at the test set repeatedly. Cross-validation is a way to use the training data efficiently for model selection.\n\nData leakage is when information from the test or validation set leaks into training. Examples: scaling or feature selection before the train test split, tuning on the test set, using future information in a time series, or augmenting data before splitting.\n\nOn imbalanced data, report more than accuracy. Use precision, recall, F1, specificity and AUC. For time series, respect temporal order. Do not train on the future and test on the past.\n\nA single evaluation can be unstable. Evaluate multiple times, use cross-validation, and report performance in more than one way.",
        keyPoints: [
          "Train, validation and test sets have different jobs.",
          "Do not tune or select features on the test set.",
          "Cross-validation estimates out of sample performance.",
          "Data leakage makes results look better than they are.",
          "On imbalanced data, report multiple metrics.",
          "For time series, respect temporal order."
        ],
        example: "Scaling the whole data set before splitting leaks test set information into training. Fit the scaler on the training set only."
      },
      {
        id: "ml-6",
        title: "Statistical ML exam traps",
        minutes: 3,
        body: "The traps are mechanical. Students confuse bagging with boosting. They say random forest uses all variables at every split. They forget to standardise before KNN. They think a single tree cannot overfit. They compute Gini for the whole data set instead of a node. They treat OOB error as the same as test error. They tune on the test set.\n\nIf a question gives a node with counts, compute the class proportions first, then Gini or entropy. If it asks for the best split, compare weighted child impurities, not raw child impurities. If it asks about random forest, mention bootstrap samples and random variable subsets. If it asks about evaluation, mention leakage and imbalanced metrics.",
        keyPoints: [
          "Bagging is parallel and reduces variance. Boosting is sequential and reduces bias.",
          "Random forest uses a random subset of variables at each split.",
          "Standardise before KNN.",
          "Compute Gini and entropy at the node level.",
          "OOB error is a built in estimate, not the same as a held out test set.",
          "Never tune on the test set."
        ],
        example: "A split with child impurities 0.2 and 0.4 is not judged by 0.2 and 0.4 alone. Weight each by the number of records in that child."
      }
    ]
  }
];

window.STUDY_FORMULAS = [
  { id: "f-mean", topic: "eda", name: "Mean", formula: "x̄ = Σx / n", meaning: "Sum every value and divide by the count.", example: "2, 4, 6, 8, 10 has mean 30 / 5 = 6." },
  { id: "f-trim", topic: "eda", name: "Trimmed mean", formula: "Drop p smallest and p largest, then average the rest", meaning: "Removes extreme values before averaging.", example: "1, 2, 3, 4, 100 with p = 1 becomes 2, 3, 4, mean 3." },
  { id: "f-weighted", topic: "eda", name: "Weighted mean", formula: "x̄w = Σ(wx) / Σw", meaning: "Each value is multiplied by its weight.", example: "Values 10 and 20 with weights 1 and 3 give (10 + 60) / 4 = 17.5." },
  { id: "f-var", topic: "eda", name: "Sample variance", formula: "s² = Σ(x - x̄)² / (n - 1)", meaning: "Average squared deviation, using n minus 1.", example: "1, 3, 5 has mean 3, squared deviations 4, 0, 4, variance 8 / 2 = 4." },
  { id: "f-sd", topic: "eda", name: "Standard deviation", formula: "s = √s²", meaning: "Square root of variance, in the original units.", example: "If variance is 16, standard deviation is 4." },
  { id: "f-iqr", topic: "eda", name: "Interquartile range", formula: "IQR = Q3 - Q1", meaning: "Spread of the middle 50 percent.", example: "Q1 = 18, Q3 = 42, IQR = 24." },
  { id: "f-pearson", topic: "eda", name: "Pearson correlation", formula: "r = Σ(x - x̄)(y - ȳ) / ((n - 1)sx sy)", meaning: "Strength and direction of linear association, from -1 to +1.", example: "r = -0.9 is a strong negative linear relationship." },
  { id: "f-slope", topic: "reg", name: "Regression slope", formula: "b1 = r sy / sx", meaning: "Change in Y per unit change in X.", example: "If r = 0.8, sy = 10, sx = 5, then b1 = 1.6." },
  { id: "f-intercept", topic: "reg", name: "Regression intercept", formula: "b0 = ȳ - b1 x̄", meaning: "Predicted Y when X is zero.", example: "ȳ = 10, x̄ = 4, b1 = 2 gives b0 = 2." },
  { id: "f-r2", topic: "reg", name: "R squared", formula: "R² = 1 - RSS / TSS", meaning: "Proportion of variance in Y explained by the model.", example: "RSS = 20, TSS = 100 gives R² = 0.80." },
  { id: "f-rmse", topic: "reg", name: "RMSE", formula: "RMSE = √(RSS / n)", meaning: "Typical prediction error in the units of Y.", example: "RSS = 400, n = 100 gives RMSE = 2." },
  { id: "f-aic", topic: "reg", name: "AIC", formula: "AIC = 2P + n ln(RSS / n)", meaning: "Fit plus a penalty for the number of parameters. Lower is better.", example: "Compare AIC values across models; smaller is preferred." },
  { id: "f-logistic", topic: "cls", name: "Logistic probability", formula: "p = 1 / (1 + e^-(b0 + b1x1 + ...))", meaning: "Turns the linear predictor into a probability between 0 and 1.", example: "If the linear predictor is 0, p = 0.5." },
  { id: "f-logodds", topic: "cls", name: "Log odds", formula: "ln(p / (1 - p)) = b0 + b1x1 + ...", meaning: "The model is linear on the log odds scale.", example: "p = 0.5 gives log odds 0." },
  { id: "f-acc", topic: "cls", name: "Accuracy", formula: "Accuracy = (TP + TN) / total", meaning: "Share of all predictions that are correct.", example: "TP 30, TN 40, total 100 gives 0.70." },
  { id: "f-prec", topic: "cls", name: "Precision", formula: "Precision = TP / (TP + FP)", meaning: "Of predicted positives, how many were real positives.", example: "TP 30, FP 20 gives 0.60." },
  { id: "f-rec", topic: "cls", name: "Recall", formula: "Recall = TP / (TP + FN)", meaning: "Of real positives, how many were caught.", example: "TP 30, FN 10 gives 0.75." },
  { id: "f-spec", topic: "cls", name: "Specificity", formula: "Specificity = TN / (TN + FP)", meaning: "Of real negatives, how many were correctly cleared.", example: "TN 40, FP 20 gives 0.667." },
  { id: "f-f1", topic: "cls", name: "F1 score", formula: "F1 = 2PR / (P + R)", meaning: "Harmonic mean of precision and recall.", example: "P = 0.6, R = 0.75 gives F1 about 0.667." },
  { id: "f-euclid", topic: "ml", name: "Euclidean distance", formula: "√Σ(ai - bi)²", meaning: "Straight line distance between two records.", example: "Points (1,2) and (4,6) give √(9 + 16) = 5." },
  { id: "f-manhattan", topic: "ml", name: "Manhattan distance", formula: "Σ|ai - bi|", meaning: "Sum of absolute differences across features.", example: "Points (1,2) and (4,6) give 3 + 4 = 7." },
  { id: "f-z", topic: "ml", name: "Standardisation", formula: "z = (x - x̄) / s", meaning: "Centres and scales a feature.", example: "x = 10, mean 6, SD 2 gives z = 2." },
  { id: "f-gini", topic: "ml", name: "Gini impurity", formula: "1 - Σpi²", meaning: "Probability of misclassifying a random record at a node. Lower is purer.", example: "6 A and 4 B gives 1 - (0.36 + 0.16) = 0.48." },
  { id: "f-entropy", topic: "ml", name: "Entropy", formula: "-Σpi log2(pi)", meaning: "Impurity measured in bits. Lower is purer.", example: "50 50 gives 1 bit. A pure node gives 0." },
  { id: "f-gain", topic: "ml", name: "Gini gain", formula: "parent Gini - weighted child Gini", meaning: "Reduction in impurity from a split. Higher is better.", example: "Parent 0.5, children 0.2 and 0.4 with equal size gives 0.2." }
];
