var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _lottos, _Winnings_instances, judgeRank_fn, isBonusWinning_fn, getMatchCount_fn, _purchasePrice;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const RANK = {
  FIRST: "1등",
  SECOND: "2등",
  THIRD: "3등",
  FOURTH: "4등",
  FIFTH: "5등"
};
const PRICE = {
  LOTTO: 1e3
};
const DEFINITION = {
  LOTTO_PRISE: {
    [RANK.FIFTH]: 5e3,
    [RANK.FOURTH]: 5e4,
    [RANK.THIRD]: 15e5,
    [RANK.SECOND]: 3e7,
    [RANK.FIRST]: 2e9
  },
  LOTTO_RULE: {
    [RANK.FIFTH]: 3,
    [RANK.FOURTH]: 4,
    [RANK.THIRD]: 5,
    [RANK.SECOND]: 5,
    [RANK.FIRST]: 6
  },
  MIN: {
    LOTTO_PURCHASE_PRICE: 1e3,
    LOTTO_NUMBER: 1
  },
  MAX: {
    LOTTO_PURCHASE_PRICE: 1e7,
    LOTTO_NUMBER: 45
  },
  EMPTY: ""
};
const ERROR = {
  WEB_WINNING_NUMBERS: {
    MESSAGE: {
      IS_DUPLICATED_NUMBER: "중복된 숫자는 입력하실 수 없습니다.",
      IS_ARRAY_NUMBER_RANGE_OVER: `${DEFINITION.MIN.LOTTO_NUMBER}~${DEFINITION.MAX.LOTTO_NUMBER} 사이의 숫자를 입력해야합니다.`,
      IS_NOT_NATURAL_NUMBER_IN_ARRAY: "숫자는 자연수여야 합니다."
    },
    ELEMENT_ID: "winningErrorInfo"
  },
  PURCHASE_PRICE: {
    MESSAGE: {
      IS_NUMBER_RANGE_OVER: `${DEFINITION.MIN.LOTTO_PURCHASE_PRICE} 이상 ${DEFINITION.MAX.LOTTO_PURCHASE_PRICE} 이하의 숫자를 입력해야합니다.`,
      IS_NOT_MULTIPLE: `${PRICE.LOTTO} 단위로 나누어 떨어지는 숫자여야합니다.`
    },
    ELEMENT_ID: "priceErrorInfo"
  }
};
const ValidationUtils = {
  isEmpty: (string) => string.trim().length === 0,
  isValidArrayLength: (array, min, max) => array.length < min || array.length > max,
  isDuplicatedNumber: (array) => new Set(array).size !== array.length,
  isArrayNumberRangeOver: (numbers, min, max) => numbers.some(
    (number) => ValidationUtils.isNumberRangeOver(number, min, max)
  ),
  isNotNaturalNumberInArray: (numbers) => numbers.some((number) => ValidationUtils.isNotNaturalNumber(number)),
  isNumberRangeOver: (number, min, max) => number < min || number > max,
  isNotNaturalNumber: (number) => number % 1 !== 0 || number < 1,
  isDuplicated: (array, element) => (/* @__PURE__ */ new Set([...array, element])).size !== array.length + 1,
  isNotMultiple: (number, unit) => number % unit !== 0 || number === 0,
  isYN: (string) => string.toLowerCase() !== "y" && string.toLowerCase() !== "n",
  isNumberConvertible: (string) => {
    if (typeof string !== "string") return false;
    const trimmed = string.trim();
    if (trimmed === "") return false;
    return !isNaN(Number(trimmed));
  }
};
const Validator = {
  userInput: (string) => {
    const errorResults = {
      IS_EMPTY: ValidationUtils.isEmpty(string)
    };
    return errorResults;
  },
  winningNumbers: (numbers) => {
    const errorResults = {
      IS_WRONG_ARRAY_LENGTH: ValidationUtils.isValidArrayLength(numbers, 6, 6),
      IS_NOT_NATURAL_NUMBER_IN_ARRAY: ValidationUtils.isNotNaturalNumberInArray(numbers),
      IS_DUPLICATED_NUMBER: ValidationUtils.isDuplicatedNumber(numbers),
      IS_ARRAY_NUMBER_RANGE_OVER: ValidationUtils.isArrayNumberRangeOver(
        numbers,
        1,
        45
      )
    };
    return errorResults;
  },
  webWinningNumbers: (numbers) => {
    const errorResults = {
      IS_VALID_ARRAY_LENGTH: ValidationUtils.isValidArrayLength(numbers, 7, 7),
      IS_DUPLICATED_NUMBER: ValidationUtils.isDuplicatedNumber(numbers),
      IS_ARRAY_NUMBER_RANGE_OVER: ValidationUtils.isArrayNumberRangeOver(
        numbers,
        1,
        45
      )
    };
    return errorResults;
  },
  submitWinningNumbers: (numbers) => {
    const errorResults = {
      IS_DUPLICATED_NUMBER: ValidationUtils.isDuplicatedNumber(numbers),
      IS_ARRAY_NUMBER_RANGE_OVER: ValidationUtils.isArrayNumberRangeOver(
        numbers,
        1,
        45
      )
    };
    return errorResults;
  },
  bonusNumber: (number) => {
    const errorResults = {
      IS_NUMBER_RANGE_OVER: ValidationUtils.isNumberRangeOver(number, 1, 45),
      IS_NOT_NATURAL_NUMBER: ValidationUtils.isNotNaturalNumber(number)
    };
    return errorResults;
  },
  winningsAndBonus: (winningNumbers, bonusNumber) => {
    const errorResults = {
      IS_DUPLICATED: ValidationUtils.isDuplicated(winningNumbers, bonusNumber)
    };
    return errorResults;
  },
  purchasePrice: (purchasePrice) => {
    const errorResults = {
      IS_NUMBER_RANGE_OVER: ValidationUtils.isNumberRangeOver(
        purchasePrice,
        DEFINITION.MIN.LOTTO_PURCHASE_PRICE,
        DEFINITION.MAX.LOTTO_PURCHASE_PRICE
      ),
      IS_NOT_MULTIPLE: ValidationUtils.isNotMultiple(purchasePrice, 1e3),
      IS_NOT_NUMBER: ValidationUtils.isNumberConvertible(purchasePrice)
    };
    return errorResults;
  },
  restart: (restart) => {
    const errorResults = {
      IS_NOT_YN: ValidationUtils.isYN(restart)
    };
    return errorResults;
  }
};
const OUTPUT_MESSAGE = {
  LOTTO_AMOUNT: (lottoAmount) => `${lottoAmount}개를 구매했습니다.`,
  WINNING_STATISTICS: "당첨 통계",
  BOUNDARY: "--------------------",
  MATCH_RESULT: (rank, amount, prize) => `${DEFINITION.LOTTO_RULE[rank]}개 일치 ${rank === RANK.SECOND ? "보너스 번호 일치" : ""}(${prize}원) - ${amount}개`,
  WINNING_RATE: (rate) => `총 수익률은 ${rate}%입니다.`
};
const WebOutput = {
  print(message) {
    console.log(message);
  },
  getHTML: (e) => document.getElementById(e),
  printLottos(lottos) {
    this.lottoAmount(lottos.length);
    this.renderLottoNumbers(lottos);
  },
  lottoAmount(lottoAmount) {
    document.querySelector(".result-container p").textContent = OUTPUT_MESSAGE.LOTTO_AMOUNT(lottoAmount);
  },
  renderLottoNumbers(lottos) {
    const resultContainer = document.querySelector(".lotto-results-box");
    let ul = document.createElement("ul");
    resultContainer.appendChild(ul);
    lottos.forEach((lotto, index) => {
      if (index % 7 === 0 && index !== 0) {
        ul = document.createElement("ul");
        resultContainer.appendChild(ul);
      }
      const li = document.createElement("li");
      li.classList.add("lotto-li");
      li.dataset.action = "copyContent";
      li.innerHTML = `<span>🎟️</span><p>${lotto.sort((a, b) => a - b).join(", ")}</p>`;
      ul.appendChild(li);
    });
  },
  winningStatistics() {
    this.print(OUTPUT_MESSAGE.WINNING_STATISTICS);
    this.print(OUTPUT_MESSAGE.BOUNDARY);
  },
  newLine() {
    this.print(DEFINITION.EMPTY);
  },
  matchResult(rank, amount) {
    const idList = {
      "5등": "fifthRank",
      "4등": "fourthRank",
      "3등": "thirdRank",
      "2등": "secondRank",
      "1등": "firstRank"
    };
    this.getHTML(idList[rank]).textContent = amount;
  },
  winningRate(rate) {
    this.getHTML("winningRate").textContent = OUTPUT_MESSAGE.WINNING_RATE(rate);
  },
  printErrorResults(errorResults, errorName) {
    Object.entries(errorResults).forEach(([key, isError]) => {
      const errorList = document.getElementById(errorName["ELEMENT_ID"]);
      if (!errorList) return;
      const errorElement = errorList.querySelector(
        `[data-error="${key}"] span`
      );
      if (errorElement) {
        errorElement.textContent = isError ? "✖️" : "✔️";
      }
    });
  }
};
function throwError(errorResult) {
  if (Object.values(errorResult).some((value) => value)) {
    const errorMessage = `유효하지 않은 입력값입니다. 다시 입력해주세요.`;
    throw new Error(errorMessage);
  }
}
function inputFormHandler({
  inputValue,
  parser,
  validatorMethod,
  errorName
}) {
  try {
    if (typeof inputValue === "string") userInputEmptyHandler(inputValue);
    const parsedUserInput = parser ? parser(inputValue) : inputValue;
    const parsedUserInputError = validatorMethod(parsedUserInput);
    WebOutput.printErrorResults(parsedUserInputError, errorName);
    throwError(parsedUserInputError);
    return parsedUserInput;
  } catch (error) {
    throw new Error(error);
  }
}
function userInputEmptyHandler(inputValue) {
  try {
    const userInputError = Validator.userInput(inputValue);
    throwError(userInputError);
  } catch (error) {
    throw new Error(error);
  }
}
const Parser = {
  toNumber: (string) => Number(string),
  toNumberArray: (stringArray) => stringArray.map((string) => Number(string))
};
function getHTML$1(e) {
  return document.getElementById(e);
}
class InputEvent {
  constructor(elem) {
    this.winningNumbers = /* @__PURE__ */ new Set();
    elem.addEventListener("input", this.onInput.bind(this));
  }
  validateIsNumber(element) {
    const isNotNumber = !ValidationUtils.isNumberConvertible(element.value);
    WebOutput.printErrorResults(
      { IS_NOT_NUMBER: isNotNumber },
      ERROR.PURCHASE_PRICE
    );
    if (isNotNumber) {
      throwError({ IS_NOT_NUMBER: isNotNumber });
      return;
    }
  }
  handlePriceInput(element) {
    this.validateIsNumber(element);
    this.validatePriceInput(element);
  }
  validatePriceInput(element) {
    try {
      inputFormHandler({
        inputValue: element.value,
        parser: Parser.toNumber,
        validatorMethod: Validator.purchasePrice,
        errorName: ERROR.PURCHASE_PRICE
      });
      getHTML$1("btnBuy").removeAttribute("disabled");
    } catch {
      getHTML$1("btnBuy").setAttribute("disabled", true);
    }
  }
  handleWinningInput(element) {
    const winningInputs = document.querySelectorAll("#winningForm input");
    const currentWinningNumbers = Array.from(
      document.querySelectorAll(".winning-bonus-box input")
    ).map((input) => input.value).filter(Boolean);
    console.log("currentWinningNumbers => ", currentWinningNumbers);
    this.handleWinningNumbers(element, winningInputs, currentWinningNumbers);
  }
  handleWinningNumbers(element, winningInputs, currentWinningNumbers) {
    element.value = this.filterValidNumbers(element.value);
    if (element.value.includes(",")) {
      this.fillNextInputs(element, winningInputs);
    }
    this.validateWinningInput(currentWinningNumbers);
  }
  filterValidNumbers(value) {
    const sanitizedValue = value.replace(/[^0-9,]/g, "");
    return sanitizedValue.length > 2 && !sanitizedValue.includes(",") ? sanitizedValue.slice(0, 2) : sanitizedValue;
  }
  fillNextInputs(element, winningInputs) {
    const values = element.value.split(",").filter(Boolean);
    element.value = values[0] || "";
    let nextIndex = [...winningInputs].indexOf(element) + 1;
    values.slice(1).forEach((val) => {
      if (winningInputs[nextIndex]) {
        winningInputs[nextIndex].value = val;
        nextIndex++;
      }
    });
    if (winningInputs[nextIndex]) {
      winningInputs[nextIndex].focus();
    }
  }
  validateWinningInput(currentWinningNumbers) {
    try {
      inputFormHandler({
        inputValue: currentWinningNumbers,
        parser: Parser.toNumberArray,
        validatorMethod: Validator.webWinningNumbers,
        errorName: ERROR.WEB_WINNING_NUMBERS
      });
    } catch {
      return;
    }
  }
  onInput(event) {
    let target = event.target.closest("[data-input]");
    if (!target) return;
    let action = target.dataset.input;
    if (action && typeof this[action] === "function") {
      this[action](target);
    }
  }
}
new InputEvent(document);
class LottoMachine {
  constructor(LottoClass) {
    __privateAdd(this, _lottos);
    this.LottoClass = LottoClass;
    this.winnings;
  }
  publishLottos(money) {
    const count = Math.floor(money / PRICE.LOTTO);
    __privateSet(this, _lottos, Array.from({ length: count }).map(
      () => new this.LottoClass()
    ));
    return __privateGet(this, _lottos).map(
      (lotto) => [...lotto.numbers].sort((a, b) => a - b)
    );
  }
  defineRule(winnings) {
    this.winnings = winnings;
  }
  drawWinning(purchasePrice) {
    const countStatistics = this.winnings.countStatistics(
      __privateGet(this, _lottos).map((lotto) => lotto.numbers)
    );
    const winningRate = this.winnings.calculateWinningRate(
      countStatistics,
      purchasePrice
    );
    return { countStatistics, winningRate };
  }
}
_lottos = new WeakMap();
class Winnings {
  constructor(numbers, bonusNumber) {
    __privateAdd(this, _Winnings_instances);
    this.validateWinnings(numbers);
    this.validateBonusNumber(bonusNumber);
    this.validateWinningsAndBonus(numbers, bonusNumber);
    this.numbers = numbers;
    this.bonusNumber = bonusNumber;
  }
  validateWinnings(numbers) {
    const errorResults = Validator.winningNumbers(numbers);
    if (Object.values(errorResults).some((value) => value)) throw new Error();
  }
  validateBonusNumber(bonusNumber) {
    const errorResults = Validator.bonusNumber(bonusNumber);
    if (Object.values(errorResults).some((value) => value)) throw new Error();
  }
  validateWinningsAndBonus(numbers, bonusNumber) {
    const errorResults = Validator.winningsAndBonus(numbers, bonusNumber);
    if (Object.values(errorResults).some((value) => value)) throw new Error();
  }
  countStatistics(lottos) {
    const counter = {
      [RANK.FIFTH]: 0,
      [RANK.FOURTH]: 0,
      [RANK.THIRD]: 0,
      [RANK.SECOND]: 0,
      [RANK.FIRST]: 0
    };
    lottos.forEach((lotto) => {
      __privateMethod(this, _Winnings_instances, judgeRank_fn).call(this, lotto, counter);
    });
    return counter;
  }
  calculateWinningRate(statistics, money) {
    const sum = Object.entries(statistics).reduce((acc, [key, count]) => {
      return acc + DEFINITION.LOTTO_PRISE[key] * count;
    }, 0);
    return Math.floor(sum / money * 100);
  }
}
_Winnings_instances = new WeakSet();
judgeRank_fn = function(lotto, counter) {
  const matchCount = __privateMethod(this, _Winnings_instances, getMatchCount_fn).call(this, lotto);
  if (__privateMethod(this, _Winnings_instances, isBonusWinning_fn).call(this, matchCount, lotto)) return counter[RANK.SECOND]++;
  switch (matchCount) {
    case 3:
      counter[RANK.FIFTH]++;
      break;
    case 4:
      counter[RANK.FOURTH]++;
      break;
    case 5:
      counter[RANK.THIRD]++;
      break;
    case 6:
      counter[RANK.FIRST]++;
      break;
  }
};
isBonusWinning_fn = function(matchCount, lotto) {
  if (matchCount === DEFINITION.LOTTO_RULE[RANK.SECOND] && lotto.includes(this.bonusNumber))
    return true;
  return false;
};
getMatchCount_fn = function(lotto) {
  const sumNumbers = [...lotto, ...this.numbers];
  const setLotto = new Set(sumNumbers);
  return sumNumbers.length - setLotto.size;
};
class Lotto {
  constructor() {
    this.numbers = Lotto.generateLottoNumbers();
  }
  static generateLottoNumbers() {
    const randomNumbers = /* @__PURE__ */ new Set();
    while (randomNumbers.size < 6) {
      const randomNumber = Math.floor(Math.random() * 44 + 1);
      randomNumbers.add(randomNumber);
    }
    return Array.from(randomNumbers);
  }
}
const WebMain = {
  purchaseLotto(purchasePrice) {
    this.lottoMachine = new LottoMachine(Lotto);
    const publishedLottos = this.lottoMachine.publishLottos(purchasePrice);
    WebOutput.printLottos(publishedLottos);
  },
  defineWinningRules(winningData) {
    const winningNumbers = [...winningData.getAll("winning")];
    winningNumbers.push(winningData.get("bonus"));
    const parsedWinningNumbers = inputFormHandler({
      inputValue: winningNumbers,
      parser: Parser.toNumberArray,
      validatorMethod: Validator.webWinningNumbers,
      errorName: ERROR.WEB_WINNING_NUMBERS
    });
    const winnings = new Winnings(parsedWinningNumbers.slice(0, -1), parsedWinningNumbers.at(-1));
    this.lottoMachine.defineRule(winnings);
  },
  printLottoResult(purchasePrice) {
    const { countStatistics, winningRate } = this.lottoMachine.drawWinning(purchasePrice);
    Object.entries(countStatistics).forEach(
      ([rank, amount]) => WebOutput.matchResult(rank, amount)
    );
    WebOutput.winningRate(winningRate);
  }
};
const getHTML = (e) => document.getElementById(e);
function openModal() {
  const modalBackground = getHTML("modalBackground");
  if (modalBackground.querySelector(".modal-box")) {
    modalBackground.classList.add("show");
    return;
  }
  const modalClone = getHTML("modalTemplate").content.cloneNode(true);
  getHTML("modalBackground").appendChild(modalClone);
  getHTML("modalBackground").classList.add("show");
}
class SubmitEvent {
  constructor(elem) {
    __privateAdd(this, _purchasePrice);
    elem.addEventListener("submit", this.onSubmit.bind(this));
  }
  handlePriceSubmit(event, form) {
    event.preventDefault();
    getHTML("priceErrorInfo").innerHTML = "";
    try {
      const priceData = new FormData(form);
      const inputPrice = priceData.get("price");
      __privateSet(this, _purchasePrice, inputFormHandler({
        inputValue: inputPrice,
        parser: Parser.toNumber,
        validatorMethod: Validator.purchasePrice,
        errorName: ERROR.PURCHASE_PRICE
      }));
      getHTML("price").setAttribute("disabled", true);
      getHTML("btnBuy").setAttribute("disabled", true);
      WebMain.purchaseLotto(__privateGet(this, _purchasePrice));
    } catch (error) {
      alert(error.message);
      return;
    }
    getHTML("resultContainer").classList.add("show");
  }
  handleWinningSubmit(event, form) {
    event.preventDefault();
    try {
      const winningData = new FormData(form);
      WebMain.defineWinningRules(winningData);
      openModal();
      window.addEventListener("keydown", (event2) => {
        if (event2.key === "Escape") {
          getHTML("modalBackground").classList.remove("show");
        }
      });
      WebMain.printLottoResult(__privateGet(this, _purchasePrice));
    } catch {
      alert("유효하지 않은 값이 있습니다. 안내 문구를 다시 확인해주세요.");
    }
  }
  onSubmit(event) {
    event.preventDefault();
    let form = event.target.closest("form");
    if (!form) return;
    if (form.id === "priceForm") {
      this.handlePriceSubmit(event, form);
    } else if (form.id === "winningForm") {
      this.handleWinningSubmit(event, form);
    }
  }
}
_purchasePrice = new WeakMap();
new SubmitEvent(document);
