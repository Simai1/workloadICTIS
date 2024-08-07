//! методы и роли которые могут ими пользоваться
const metods = [
  {
    id: 1,
    name: "Получение всех преподавателей",
  },
  //! но зк и зам зк в разделе преподов будет получать их по кафедре
  {
    id: 1.1,
    name: "Получение всех преподавателей по своему институт",
  },
  {
    id: 2,
    name: "Получение преподавателей по своей кафедре",
  },
  {
    id: 3,
    name: "Доступ к таблице преподавателей",
  },
  {
    id: 4,
    name: "Создание преподавателя",
  },
  {
    id: 8,
    name: "Обновление некоторых данных нагрузки",
  },
  {
    id: 8.1,
    name: "Обновление всех данных нагрузки",
  },
  {
    id: 9,
    name: "Добавление преподавателя на нагрузку",
  },
  {
    id: 10,
    name: "Удаление преподавателя с нагрузки",
  },
  {
    id: 11,
    name: "Разделение нагрузки",
  },
  {
    id: 11.1,
    name: "Разделение нагрузки по часам",
  },
  {
    id: 12,
    name: "Соединение нагрузки",
  },
  {
    id: 13,
    name: "Удаление нагрузки",
  },
  {
    id: 14,
    name: "Получение всех нагрузок",
  },
  {
    id: 15,
    name: "Получение нагрузок по кафедре",
  },
  {
    id: 16,
    name: "кнопка назад из карточки",
  },

  {
    id: 17,
    name: "Получение всех предложений",
  },
  {
    id: 17.1,
    name: "Получение своих предложений лектором",
  },
  {
    id: 18,
    name: "Предложить преподавателя",
  },
  {
    id: 20,
    name: "Получить все комментарии к нагрузке ",
  },
  {
    id: 21,
    name: "Удаление комментариев ",
  },
  {
    id: 22,
    name: "Создать комментраий ",
  },
  {
    id: 23,
    name: "Получение предупреждений",
  },
  {
    id: 24,
    name: "Открытие личного кабинета",
  },
  {
    id: 25,
    name: "Кнопка отменить действие",
  },
  {
    id: 26,
    name: "Кнопка сохранения",
  },
  {
    id: 27,
    name: "Кнопка отправить таблицу",
  },
  {
    id: 28,
    name: "Кнопка все дисциплины",
  },
  {
    id: 29,
    name: "Получение истории изменений для методиста",
  },
  {
    id: 30,
    name: "Кнопка предупреждений",
  },
  {
    id: 31,
    name: "Закрепить/Открепить",
  },
  {
    id: 32,
    name: "Получение Зк нагрузок только его кафедры ",
  },
  {
    id: 33,
    name: "Блокировка таблицы для ЗК",
  },
  {
    id: 33.1,
    name: "Возможность видеть блокированные строки",
  },
  {
    id: 33.2,
    name: "Блокированные выделяются надписью для лекторов и преподов также влияет на контекстное меню",
  },
  {
    id: 34,
    name: "Возможность видеть предложения",
  },
  {
    id: 35,
    name: "Возможность импорта файла",
  },
  {
    id: 36,
    name: "Измененные в FiltredRows",
  },
  {
    id: 37,
    name: "Лектор видит свои комменты",
  },
  {
    id: 38,
    name: "Возможность применить предложения и отклонить его",
  },
  {
    id: 38.2,
    name: "Возможность отклонить свое предложение",
  },
  {
    id: 39,
    name: "Выбор кафедры при создании и редактироании преподователя",
  },
  {
    id: 40,
    name: "Получаем предметы в личной карточке преподавателя",
  },
  {
    id: 41,
    name: "Получаем объекта для препода и лектора",
  },
  {
    id: 42,
    name: "Получение начальной кафедры для администратора подразделения",
  },
  {
    id: 43,
    name: "Вывод всех кафедр импорт добавление",
  },
  {
    id: 44,
    name: "Метод получения всех нагрузок",
  },
  {
    id: 45,
    name: "Получение всех пользователей для супер юзера",
  },
  {
    id: 46,
    name: "Получение полного списка кафедр",
  },
  {
    id: 47,
    name: "Получение списка кафедр для создания преподоватекля методистом и директором",
  },
  {
    id: 48,
    name: "Метод для разблокировки таблицы",
  },
  {
    id: 49,
    name: "Метод попросить разблокировку таблицы",
  },
  {
    id: 50,
    name: "экспорт таблицы",
  },
  {
    id: 51,
    name: "экспорт таблицы для зк",
  },
  {
    id: 52,
    name: "Получение текущей суммы и остатка по нагрузкам для ЗК",
  },
  {
    id: 53,
    name: "Обновление таблицы общей",
  },
  {
    id: 54,
    name: "Возможность видеть материалы к расписанию",
  },
  {
    id: 54.1,
    name: "Возможность открывать контекстное меню в рассписании",
  },
  {
    id: 55,
    name: "Возможность видеть материалы к расписанию для крутых",
  },
  {
    id: 56,
    name: "Моя нагрузка для ЗК как лектора",
  },
  {
    id: 57,
    name: "Синхоризация нагрузок",
  },
  {
    id: 58,
    name: "Синхоризация нагрузок для рядовых пользователей",
  },
];
