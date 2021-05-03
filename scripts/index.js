const QUESTIONS = [
  {
    title: "Qual é seu nome?",
    user: "admin",
    dateCreate: new Date().toLocaleDateString("pt-br"),
    question:
      "Precisamos te conhecer um pouco e queremos saber o seu nome, pode nos dizer?",
  },
  {
    title: "Qual sua idade?",
    user: "admin",
    dateCreate: new Date().toLocaleDateString("pt-br"),
    question:
      "Precisamos te conhecer um pouco e queremos saber o sua idade, pode nos dizer?",
  },
  {
    title: "Qual é a sua Solução favorita da Agrotools?",
    user: "admin",
    dateCreate: new Date().toLocaleDateString("pt-br"),
    question:
      "Você sabia que temos, pelo menos, 6 (seis) soluções para o seu negócio?\nQual ou quais dessas soluções são as suas preferidas?",
  },
  {
    title: "Já conhece os Materiais da Agrotools?",
    user: "admin",
    dateCreate: new Date().toLocaleDateString("pt-br"),
    question:
      "Você sabia que temos materiais importantes para o seu negócio?\nQual ou quais desses materiais você já utilizou?",
  },
];

const ANSWER = [
  {
    idQuestion: 0,
    answer: "José Eduardo",
    dateAnswer: new Date().toLocaleDateString("pt-br"),
    lat: -22.8777,
    lon: -48.5179,
  },
  {
    idQuestion: 1,
    answer: "Tenho 35 anos",
    dateAnswer: new Date().toLocaleDateString("pt-br"),
    lat: -22.8777,
    lon: -48.5179,
  },
  {
    idQuestion: 2,
    answer: "Gostei principalmente de duas soluções, a Supply e a Safe.",
    dateAnswer: new Date().toLocaleDateString("pt-br"),
    lat: -22.8777,
    lon: -48.5179,
  },
  {
    idQuestion: 3,
    answer: "Já havia visto a seção de Materiais, e já utilizei os vídeos.",
    dateAnswer: new Date().toLocaleDateString("pt-br"),
    lat: -22.8777,
    lon: -48.5179,
  },
  {
    idQuestion: 0,
    answer: "José Eduardo Rodrigues Pinto",
    dateAnswer: new Date().toLocaleDateString("pt-br"),
    lat: -21.2016,
    lon: -50.4303,
  },
  {
    idQuestion: 1,
    answer: "35 anos",
    dateAnswer: new Date().toLocaleDateString("pt-br"),
    lat: -21.2016,
    lon: -50.4303,
  },
];

const btnCreate = document.querySelector('[data-js="create"]');
const btnAnswer = document.querySelector('[data-js="btnAnswer"]');
const formCreate = document.querySelector('[data-js="formCreate"');
const answerSection = document.querySelector('[data-js="answerSection"');

const updateLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const teste = (localArray, id, lat, lon) => {
  const alreadyAnswered = localArray.find(
    (item) =>
      item.idQuestion === Number(id) &&
      item.lat === Number(lat) &&
      item.lon === Number(lon)
  );

  if (!alreadyAnswered) {
    return null;
  }
  alert(`Você já respondeu esse questionário em ${alreadyAnswered.dateAnswer}`);
  setTimeout(() => window.location.reload(), 1500);

  return alreadyAnswered.answer;
};

btnCreate.addEventListener("click", () => {
  if (!answerSection.classList.contains("hidden")) {
    answerSection.classList.add("hidden");
  }

  const dateCreate = (document.querySelector(
    `[name="dateCreate"]`
  ).value = new Date().toLocaleDateString("pt-br"));
  const submitCreateQuestion = document.querySelector(
    '[data-js="submitCreateQuestion"]'
  );

  submitCreateQuestion.addEventListener("click", (event) => {
    event.preventDefault();

    const [title, user, question] = ["title", "user", "question"].map((name) =>
      document.querySelector(`[name="${name}"]`)
    );
    if (!title || !user || !question) {
      return alert("Tem que preencher todos os campos");
    }

    const localQuestions = JSON.parse(localStorage.getItem("@beAt:questions"));
    if (!localQuestions) {
      const data = [
        ...QUESTIONS,
        {
          title: title.value,
          user: user.value,
          dateCreate,
          question: question.value,
        },
      ];
      updateLocalStorage("@beAt:questions", data);
    } else {
      const data = [
        ...localQuestions,
        {
          title: title.value,
          user: user.value,
          dateCreate,
          question: question.value,
        },
      ];
      updateLocalStorage("@beAt:questions", data);
    }

    alert(`Obrigado ${user.value} por criar esse questionário! 📝`);
    formCreate.classList.add("hidden");
    title.value = null;
    user.value = null;
    dateCreate.value = null;
    question.value = null;
    setTimeout(() => window.location.reload(), 1500);
  });

  formCreate.classList.toggle("hidden");
});

btnAnswer.addEventListener("click", () => {
  if (!formCreate.classList.contains("hidden")) {
    formCreate.classList.add("hidden");
  }

  if (!("geolocation" in navigator)) {
    return alert("✋ Navegador não tem suporte API Geolocation ⚠️");
  }

  const localQuestions = JSON.parse(localStorage.getItem("@beAt:questions"));

  if (!localQuestions) {
    return alert("✋ Não existem questionários para serem respondidos! ⚠️");
  }

  const select = document.querySelector("section select");
  const questionSelected = document.querySelector(
    '[data-js="questionSelected"]'
  );
  const questionSelectedList = document.querySelector(
    '[data-js="questionSelectedList"]'
  );

  select.innerHTML = "<option selected disabled>Selecione a questão</option>";
  localQuestions.map((question, index) => {
    select.innerHTML += `<option value="${index}">${question.title}</option>`;
  });

  select.addEventListener("change", function () {
    const itemSelected = localQuestions[this.value];
    const title = document.querySelector(
      '[data-js="questionSelectedTitleText"]'
    );
    const dateCreate = document.querySelector(
      '[data-js="questionSelectedDateText"]'
    );
    const dateAnswer = document.querySelector(
      '[data-js="questionSelectedDateAnswer"]'
    );
    const answer = document.querySelector(
      '[data-js="questionSelectedInputAnswer"]'
    );
    const lat = document.querySelector('[data-js="questionSelectedLat"]');
    const lon = document.querySelector('[data-js="questionSelectedLon"]');
    const submitAnswer = document.querySelector('[data-js="submitAnswer"]');
    const localAnswer = JSON.parse(localStorage.getItem("@beAt:answer"));

    questionSelectedList.innerHTML = null;
    localAnswer &&
      localAnswer
        .filter((item) => item.idQuestion === Number(this.value))
        .map(
          (item) =>
            (questionSelectedList.innerHTML += `<li>Resposta cadastrada em ${item.dateAnswer}: ${item.answer}, na Lat/Long: ${item.lat}/${item.lon}</li>`)
        );

    navigator.geolocation.getCurrentPosition((position) => {
      answer.value = null;
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      lat.value = latitude;
      lon.value = longitude;

      if (localAnswer) {
        answer.value = teste(localAnswer, this.value, lat.value, lon.value);
      }
    });

    title.innerHTML = itemSelected.question;
    dateCreate.innerHTML = itemSelected.dateCreate;
    dateAnswer.value = new Date().toLocaleDateString("pt-br");

    submitAnswer.addEventListener("click", (event) => {
      event.preventDefault();
      if (!answer.value || !dateAnswer.value || !lat.value || !lon.value) {
        return alert("Tem que preencher todos os campos");
      }

      if (!localAnswer) {
        const data = [
          ...ANSWER,
          {
            idQuestion: Number(this.value),
            answer: answer.value,
            dateAnswer: dateAnswer.value,
            lat: Number(lat.value),
            lon: Number(lon.value),
          },
        ];
        updateLocalStorage("@beAt:answer", data);
      } else {
        const data = [
          ...localAnswer,
          {
            idQuestion: Number(this.value),
            answer: answer.value,
            dateAnswer: dateAnswer.value,
            lat: Number(lat.value),
            lon: Number(lon.value),
          },
        ];
        updateLocalStorage("@beAt:answer", data);
      }

      alert(`Obrigado por responder esse questionário! 📝`);

      answer.value = null;
      dateAnswer.value = null;
      lat.value = null;
      lon.value = null;
      questionSelectedList.classList.add("hidden");
      questionSelected.classList.add("hidden");
      answerSection.classList.add("hidden");
      setTimeout(() => window.location.reload(), 1500);
    });

    questionSelected.classList.remove("hidden");
    questionSelectedList.classList.remove("hidden");
  });

  questionSelected.classList.add("hidden");
  questionSelectedList.classList.add("hidden");
  answerSection.classList.toggle("hidden");
});
