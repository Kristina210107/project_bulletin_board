// app/static/js/index.js
// Простая реализация nanoid
function nanoid(size = 21) {
    const alphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';
    let id = '';
    let i = size;
    while (i--) {
        id += alphabet[(Math.random() * 64) | 0];
    }
    return id;
}

const app = (() => {
    // Хранилище данных
    let offers = [];
    let requests = [];
    let stories = [];
    let conversations = [];

    // DOM элементы
    const listEl = document.getElementById('list');
    const emptyEl = document.getElementById('empty');
    const requestsEl = document.getElementById('requests');
    const storiesEl = document.getElementById('stories');
    const offerTpl = document.getElementById('offer-template');

    // Инициализация демо-данных с 50+ товарами
    function seed() {
        // Демо товары (50+ товаров)
        offers = [
            // 15 товаров как раньше
            createOffer({
                title: 'Сборник советских сказок',
                desc: 'В отличном состоянии, 200 страниц. Ищу детскую одежду или игрушку.',
                category: 'Книги',
                owner: 'Ольга',
                likes: 18,
                img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop',
                specs: ['200 стр.', 'Твёрдый переплёт', 'Вес 420 г'],
                location: 'Москва, м. Чистые пруды'
            }),
            createOffer({
                title: 'Детская теплая куртка (110 см)',
                desc: 'Пару раз носили, тёплая и чистая. Отдам в обмен на настольные игры.',
                category: 'Одежда',
                owner: 'Марат',
                likes: 9,
                img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop',
                specs: ['Размер 110', 'Синтепон', 'Практически новая'],
                location: 'Санкт-Петербург, Приморский р-н'
            }),
            createOffer({
                title: 'Светильник настольный — рабочий',
                desc: 'Ищем азы для ремонта: отвертки/клещи или помощь с мелким ремонтом',
                category: 'Техника',
                owner: 'Екатерина',
                likes: 6,
                img: 'https://images.unsplash.com/photo-1526481280698-49b77a2b52e7?q=80&w=800&auto=format&fit=crop',
                specs: ['LED', 'Регулировка яркости', 'Потребление 6W'],
                location: 'Казань, центр'
            }),
            createOffer({
                title: 'Набор керамических кружек',
                desc: '6 штук, небольшой скол на одной — отдам за растения или книги.',
                category: 'Дом',
                owner: 'Лена',
                likes: 4,
                img: 'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=800&auto=format&fit=crop',
                specs: ['6 шт.', 'Диаметр 8 см', 'Есть скол на одной'],
                location: 'Екатеринбург, Втузгородок'
            }),
            createOffer({
                title: 'Рюкзак городской, почти новый',
                desc: 'Удобные отделения, идеален для учебы или прогулок — обмен на детские вещи.',
                category: 'Одежда',
                owner: 'Дима',
                likes: 11,
                img: 'https://images.unsplash.com/photo-1520975916232-04dfb3f2f6d9?q=80&w=800&auto=format&fit=crop',
                specs: ['Объём 22 л', 'Влагостойкий', 'Отделение ноутбука 15"'],
                location: 'Нижний Новгород, Проспект Ленина'
            }),
            createOffer({
                title: 'Настольная игра «Колонизаторы»',
                desc: 'Полный комплект, правила на русском. Отдам в обмен на книги или наборы для творчества.',
                category: 'Развлечения',
                owner: 'Мария',
                likes: 22,
                img: 'https://images.unsplash.com/photo-1585747861900-6b4b4b0f8b2b?q=80&w=800&auto=format&fit=crop',
                specs: ['Полный комплект', 'Фигурки в комплекте', 'Инструкция'],
                location: 'Ростов-на-Дону, центр'
            }),
            createOffer({
                title: 'Газовая плита в хорошем состоянии',
                desc: 'Работает без нареканий, нужны инструменты или помощь с установкой.',
                category: 'Техника',
                owner: 'Илья',
                likes: 3,
                img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
                specs: ['4 конфорки', 'Газовая', 'Высота 85 см'],
                location: 'Самара, Железнодорожный р-н'
            }),
            createOffer({
                title: 'Кресло-качалка',
                desc: 'Уютное, лёгкие потертости на подлокотниках — обмен на детскую мебель.',
                category: 'Мебель',
                owner: 'Наташа',
                likes: 7,
                img: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=800&auto=format&fit=crop',
                specs: ['Материал: дерево', 'Ширина 62 см', 'Нагрузка до 100 кг'],
                location: 'Воронеж, центр'
            }),
            createOffer({
                title: 'Детский велосипед 16"',
                desc: 'Отличное состояние, звоните для примерки. Желателен обмен на зимнюю одежду.',
                category: 'Детское',
                owner: 'Сергей',
                likes: 14,
                img: 'https://images.unsplash.com/photo-1518655048521-f130df041f66?q=80&w=800&auto=format&fit=crop',
                specs: ['Колёса 16"', 'Состояние отличное', 'Рост 110–130 см'],
                location: 'Пермь, мкр. Парковый'
            }),
            createOffer({
                title: 'Набор инструментов базовый',
                desc: 'Отдам в обмен на книги по рукоделию или помощь с ремонтом мебели.',
                category: 'Инструменты',
                owner: 'Роман',
                likes: 5,
                img: 'https://images.unsplash.com/photo-1581091012184-7f5c7c5d9b2b?q=80&w=800&auto=format&fit=crop',
                specs: ['20 предметов', 'Чехол в комплекте', 'Для бытового ремонта'],
                location: 'Уфа, Советский р-н'
            }),

            // Дополнительные 40+ товаров
            createOffer({
                title: 'Швейная машина (рабочая)',
                desc: 'Помогу с уроками по шитью — отдам в обмен на материалы или книги.',
                category: 'Техника',
                owner: 'Саша',
                likes: 10,
                img: 'https://images.unsplash.com/photo-1581091012184-7f5c7c5d9b2b?q=80&w=800&auto=format&fit=crop',
                specs: ['Электрическая', 'Чехол в комплекте', 'Рабочая'],
                location: 'Калуга, центр'
            }),
            createOffer({
                title: 'Коллекция марок (начинающая)',
                desc: 'Первые шаги коллекционирования — обменяю на книги о истории или альбомы.',
                category: 'Коллекции',
                owner: 'Валя',
                likes: 2,
                img: 'https://images.unsplash.com/photo-1526318472351-c75fcf0707c0?q=80&w=800&auto=format&fit=crop',
                specs: ['~120 марок', 'Разных годов', 'Без редких экземпляров'],
                location: 'Ярославль, центр'
            }),
            createOffer({
                title: 'Кухонный комбайн',
                desc: 'Функционал в порядке, есть все насадки. Рассмотрю обмен на садовые инструменты.',
                category: 'Техника',
                owner: 'Олег',
                likes: 8,
                img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
                specs: ['Насадки в комплекте', 'Мощность 700W', 'Чаша 2.5 л'],
                location: 'Вологда, центр'
            }),
            createOffer({
                title: 'Плед шерстяной',
                desc: 'Тёплый, без пятен. Отдам за набор посуды или комнатное растение.',
                category: 'Дом',
                owner: 'Галина',
                likes: 12,
                img: 'https://images.unsplash.com/photo-1505691723518-36a2b9772be9?q=80&w=800&auto=format&fit=crop',
                specs: ['150x200 см', '100% шерсть', 'Есть сумка для хранения'],
                location: 'Тула, Привокзальный'
            }),
            createOffer({
                title: 'Старый фотоаппарат (плёночный)',
                desc: 'Рабочий, требует проявки. Ищу книги или аксессуары для фото.',
                category: 'Техника',
                owner: 'Виктор',
                likes: 16,
                img: 'https://images.unsplash.com/photo-1504198458649-3128b932f49b?q=80&w=800&auto=format&fit=crop',
                specs: ['Плёночный', 'Объектив 50мм', 'В комплекте сумка'],
                location: 'Иркутск, центр'
            }),
            createOffer({
                title: 'Мягкие игрушки (комплект)',
                desc: '3 игрушки в хорошем состоянии, отдам за детские книги.',
                category: 'Детское',
                owner: 'Анна',
                likes: 7,
                img: 'https://images.unsplash.com/photo-1535083252457-6080fe29be45?q=80&w=800&auto=format&fit=crop',
                specs: ['3 шт.', 'Высота 25-30 см', 'Можно стирать'],
                location: 'Тверь, центр'
            }),
            createOffer({
                title: 'Электрочайник',
                desc: 'Рабочий, только что почистили. Обмен на кухонную утварь.',
                category: 'Техника',
                owner: 'Михаил',
                likes: 4,
                img: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?q=80&w=800&auto=format&fit=crop',
                specs: ['Объём 1.7 л', 'Мощность 2000W', 'Автоматическое отключение'],
                location: 'Брянск, центр'
            }),
            createOffer({
                title: 'Спортивный костюм (M)',
                desc: 'Носили пару раз, почти новый. Обмен на обувь 42-43 размера.',
                category: 'Одежда',
                owner: 'Андрей',
                likes: 9,
                img: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=800&auto=format&fit=crop',
                specs: ['Размер M', 'Ткань: полиэстер', 'Тёмно-синий'],
                location: 'Смоленск, центр'
            }),
            createOffer({
                title: 'Глобус настольный',
                desc: 'Старинный глобус 70-х годов, в рабочем состоянии. Обмен на книги.',
                category: 'Дом',
                owner: 'Пётр',
                likes: 11,
                img: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=800&auto=format&fit=crop',
                specs: ['Диаметр 30 см', 'Деревянная подставка', '1970-е годы'],
                location: 'Владимир, центр'
            }),
            createOffer({
                title: 'Набор для вышивания',
                desc: 'Полный набор ниток и канвы. Обмен на материалы для вязания.',
                category: 'Хобби',
                owner: 'Елена',
                likes: 6,
                img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop',
                specs: ['10 цветов ниток', 'Канва Aida', 'Схема в комплекте'],
                location: 'Орёл, центр'
            }),
            createOffer({
                title: 'Лыжи беговые (175 см)',
                desc: 'В отличном состоянии, пару раз использовались. Обмен на зимнюю одежду.',
                category: 'Спорт',
                owner: 'Денис',
                likes: 8,
                img: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=800&auto=format&fit=crop',
                specs: ['Длина 175 см', 'Крепления в комплекте', 'Состояние отличное'],
                location: 'Киров, центр'
            }),
            createOffer({
                title: 'Микроволновая печь',
                desc: 'Работает без нареканий, нужна небольшая мебель.',
                category: 'Техника',
                owner: 'Светлана',
                likes: 13,
                img: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=800&auto=format&fit=crop',
                specs: ['Мощность 800W', 'Объём 20 л', 'Гриль в комплекте'],
                location: 'Чебоксары, центр'
            }),
            createOffer({
                title: 'Набор бокалов для вина',
                desc: '6 штук, хрусталь. Обмен на посуду или книги.',
                category: 'Дом',
                owner: 'Ирина',
                likes: 15,
                img: 'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?q=80&w=800&auto=format&fit=crop',
                specs: ['6 шт.', 'Хрусталь', 'Объём 250 мл'],
                location: 'Курск, центр'
            }),
            createOffer({
                title: 'Гитара акустическая',
                desc: 'Нужна замена струн, в остальном хорошая. Обмен на музыкальные инструменты.',
                category: 'Музыка',
                owner: 'Артём',
                likes: 21,
                img: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?q=80&w=800&auto=format&fit=crop',
                specs: ['Акустическая', 'Нужны струны', 'Чехол в комплекте'],
                location: 'Белгород, центр'
            }),
            createOffer({
                title: 'Шкаф для одежды',
                desc: 'Разборный, состояние хорошее. Нужна помощь с транспортировкой.',
                category: 'Мебель',
                owner: 'Николай',
                likes: 5,
                img: 'https://images.unsplash.com/photo-1528747045269-390fe33c19f2?q=80&w=800&auto=format&fit=crop',
                specs: ['Ширина 180 см', 'Высота 200 см', 'Разборный'],
                location: 'Липецк, центр'
            }),
            createOffer({
                title: 'Аквариум 50 литров',
                desc: 'С подсветкой, нужен фильтр. Обмен на растения или книги.',
                category: 'Дом',
                owner: 'Марина',
                likes: 9,
                img: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=800&auto=format&fit=crop',
                specs: ['Объём 50 л', 'Подсветка LED', 'Нужен фильтр'],
                location: 'Ставрополь, центр'
            }),
            createOffer({
                title: 'Беговая дорожка',
                desc: 'Требует небольшого ремонта. Обмен на спортивный инвентарь.',
                category: 'Спорт',
                owner: 'Вадим',
                likes: 7,
                img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop',
                specs: ['Электрическая', 'Требует ремонта', 'Разборная'],
                location: 'Краснодар, центр'
            }),
            createOffer({
                title: 'Книга рецептов советской кухни',
                desc: 'Сборник 1985 года, в хорошем состоянии. Обмен на кухонную утварь.',
                category: 'Книги',
                owner: 'Татьяна',
                likes: 14,
                img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop',
                specs: ['1985 год', 'Твёрдый переплёт', '300 страниц'],
                location: 'Волгоград, центр'
            }),
            createOffer({
                title: 'Набор для барбекю',
                desc: 'Мангал и инструменты. Обмен на садовые инструменты.',
                category: 'Дом',
                owner: 'Константин',
                likes: 18,
                img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop',
                specs: ['Мангал', '6 инструментов', 'Переносной'],
                location: 'Саратов, центр'
            }),
            createOffer({
                title: 'Компьютерный стол',
                desc: 'С полками, состояние хорошее. Обмен на офисную мебель.',
                category: 'Мебель',
                owner: 'Александр',
                likes: 6,
                img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop',
                specs: ['Длина 120 см', 'С полками', 'Цвет: белый'],
                location: 'Ульяновск, центр'
            }),
            createOffer({
                title: 'Колонки для компьютера',
                desc: 'Рабочие, хороший звук. Обмен на аксессуары для ПК.',
                category: 'Техника',
                owner: 'Евгений',
                likes: 11,
                img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop',
                specs: ['2.0 система', 'Мощность 20W', 'Чёрный цвет'],
                location: 'Томск, центр'
            }),
            createOffer({
                title: 'Зимние шины (R16)',
                desc: 'Остаток 5-6 мм, 4 штуки. Обмен на летние шины или инструменты.',
                category: 'Авто',
                owner: 'Владимир',
                likes: 12,
                img: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=800&auto=format&fit=crop',
                specs: ['R16', 'Остаток 5-6 мм', '4 шт.'],
                location: 'Кемерово, центр'
            }),
            createOffer({
                title: 'Настольная лампа',
                desc: 'С регулировкой яркости. Обмен на книги или комнатные растения.',
                category: 'Дом',
                owner: 'Надежда',
                likes: 8,
                img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop',
                specs: ['LED', 'Регулировка яркости', 'Гибкая ножка'],
                location: 'Новокузнецк, центр'
            }),
            createOffer({
                title: 'Роликовые коньки (42 размер)',
                desc: 'Носили один сезон, в хорошем состоянии. Обмен на спортивный инвентарь.',
                category: 'Спорт',
                owner: 'Павел',
                likes: 10,
                img: 'https://images.unsplash.com/photo-1541593352784-dc78b1578a01?q=80&w=800&auto=format&fit=crop',
                specs: ['Размер 42', 'Колёса 80 мм', 'Защита в комплекте'],
                location: 'Магнитогорск, центр'
            }),
            createOffer({
                title: 'Энциклопедия животных',
                desc: 'В 3 томах, состояние отличное. Обмен на детские книги.',
                category: 'Книги',
                owner: 'Оксана',
                likes: 16,
                img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
                specs: ['3 тома', 'Твёрдый переплёт', 'Цветные иллюстрации'],
                location: 'Сочи, центр'
            }),
            createOffer({
                title: 'Набор отверток',
                desc: 'Профессиональный набор, 15 штук. Обмен на электроинструменты.',
                category: 'Инструменты',
                owner: 'Иван',
                likes: 7,
                img: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop',
                specs: ['15 предметов', 'Профессиональные', 'Кейс в комплекте'],
                location: 'Тюмень, центр'
            }),
            createOffer({
                title: 'Мольберт для рисования',
                desc: 'Деревянный, регулируемый. Обмен на материалы для творчества.',
                category: 'Хобби',
                owner: 'Алиса',
                likes: 13,
                img: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=800&auto=format&fit=crop',
                specs: ['Деревянный', 'Регулируемый', 'Высота до 180 см'],
                location: 'Ижевск, центр'
            }),
            createOffer({
                title: 'Электронные весы кухонные',
                desc: 'Точные, с таймером. Обмен на кухонную утварь.',
                category: 'Техника',
                owner: 'Людмила',
                likes: 5,
                img: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop',
                specs: ['Взвешивание до 5 кг', 'Точность 1 г', 'Таймер'],
                location: 'Барнаул, центр'
            }),
            createOffer({
                title: 'Набор для настольного тенниса',
                desc: '2 ракетки, сетка, мячики. Обмен на спортивный инвентарь.',
                category: 'Спорт',
                owner: 'Максим',
                likes: 14,
                img: 'https://images.unsplash.com/photo-1595435934247-5d33b7f92c70?q=80&w=800&auto=format&fit=crop',
                specs: ['2 ракетки', 'Сетка', '6 мячиков'],
                location: 'Владивосток, центр'
            }),
            createOffer({
                title: 'Коллекция минералов',
                desc: '10 разных образцов. Обмен на книги по геологии.',
                category: 'Коллекции',
                owner: 'Георгий',
                likes: 9,
                img: 'https://images.unsplash.com/photo-1542736667-069246bdbc6d?q=80&w=800&auto=format&fit=crop',
                specs: ['10 образцов', 'Разные минералы', 'С описанием'],
                location: 'Хабаровск, центр'
            }),
            createOffer({
                title: 'Кофемашина капсульная',
                desc: 'Рабочая, нужны капсулы. Обмен на кухонную технику.',
                category: 'Техника',
                owner: 'Антон',
                likes: 17,
                img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop',
                specs: ['Капсульная', 'Автоматическая', 'Нужны капсулы'],
                location: 'Красноярск, центр'
            }),
            createOffer({
                title: 'Набор для выпечки',
                desc: 'Формы, венчики, лопатки. Обмен на кухонную утварь.',
                category: 'Дом',
                owner: 'Виктория',
                likes: 8,
                img: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=800&auto=format&fit=crop',
                specs: ['10 предметов', 'Металл/силикон', 'Нержавеющая сталь'],
                location: 'Омск, центр'
            }),
            createOffer({
                title: 'Бинокль',
                desc: 'Увеличение 10x, в хорошем состоянии. Обмен на оптику или книги.',
                category: 'Хобби',
                owner: 'Дмитрий',
                likes: 11,
                img: 'https://images.unsplash.com/photo-1590691565924-90d0a14443a8?q=80&w=800&auto=format&fit=crop',
                specs: ['Увеличение 10x', 'Линзы защищены', 'Чехол в комплекте'],
                location: 'Челябинск, центр'
            }),
            createOffer({
                title: 'Детский самокат',
                desc: 'Для детей 5-8 лет, в хорошем состоянии. Обмен на детские вещи.',
                category: 'Детское',
                owner: 'Евгения',
                likes: 6,
                img: 'https://images.unsplash.com/photo-1571066811602-716837d681de?q=80&w=800&auto=format&fit=crop',
                specs: ['Для 5-8 лет', 'Регулируемый руль', 'Колёса 120 мм'],
                location: 'Пенза, центр'
            }),
            createOffer({
                title: 'Набор для ухода за обувью',
                desc: 'Кремы, щётки, спреи. Обмен на средства для дома.',
                category: 'Одежда',
                owner: 'Анатолий',
                likes: 4,
                img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop',
                specs: ['5 средств', 'Щётки', 'Аппликаторы'],
                location: 'Рязань, центр'
            }),
            createOffer({
                title: 'Карта мира (большая)',
                desc: 'Настенная, ламинированная. Обмен на книги или канцтовары.',
                category: 'Дом',
                owner: 'Сергей',
                likes: 12,
                img: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800&auto=format&fit=crop',
                specs: ['Размер 100x70 см', 'Ламинированная', 'Настенная'],
                location: 'Астрахань, центр'
            }),
            createOffer({
                title: 'Набор для пикника',
                desc: 'Посуда, термос, плед. Обмен на туристическое снаряжение.',
                category: 'Дом',
                owner: 'Мария',
                likes: 15,
                img: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?q=80&w=800&auto=format&fit=crop',
                specs: ['4 персоны', 'Термос 1 л', 'Плед в комплекте'],
                location: 'Калининград, центр'
            }),
            createOffer({
                title: 'Электрогриль',
                desc: 'Рабочий, требуется чистка. Обмен на кухонную технику.',
                category: 'Техника',
                owner: 'Андрей',
                likes: 9,
                img: 'https://images.unsplash.com/photo-1551385053-d55d12e91c4b?q=80&w=800&auto=format&fit=crop',
                specs: ['Мощность 2000W', 'Поверхность антипригарная', 'Требует чистки'],
                location: 'Мурманск, центр'
            }),
            createOffer({
                title: 'Набор для лепки (детский)',
                desc: 'Глина, инструменты, инструкция. Обмен на детские игрушки.',
                category: 'Детское',
                owner: 'Ольга',
                likes: 7,
                img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop',
                specs: ['Глина 1 кг', '10 инструментов', 'Инструкция'],
                location: 'Архангельск, центр'
            }),
            createOffer({
                title: 'Старинные часы (настенные)',
                desc: 'Маятниковые, рабочие. Обмен на антиквариат или книги.',
                category: 'Дом',
                owner: 'Василий',
                likes: 19,
                img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
                specs: ['Маятниковые', 'Рабочие', 'Деревянный корпус'],
                location: 'Великий Новгород, центр'
            }),
            createOffer({
                title: 'Набор для бадминтона',
                desc: '2 ракетки, волан, сетка. Обмен на спортивный инвентарь.',
                category: 'Спорт',
                owner: 'Никита',
                likes: 10,
                img: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800&auto=format&fit=crop',
                specs: ['2 ракетки', 'Волан', 'Переносная сетка'],
                location: 'Псков, центр'
            }),
            createOffer({
                title: 'Книжная полка',
                desc: 'Деревянная, 3 полки. Обмен на мебель или книги.',
                category: 'Мебель',
                owner: 'Лариса',
                likes: 8,
                img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop',
                specs: ['Деревянная', '3 полки', 'Высота 120 см'],
                location: 'Кострома, центр'
            }),
            createOffer({
                title: 'Набор для каллиграфии',
                desc: 'Перья, чернила, бумага. Обмен на материалы для творчества.',
                category: 'Хобби',
                owner: 'Екатерина',
                likes: 13,
                img: 'https://images.unsplash.com/photo-1583484963886-cfe2bff2945f?q=80&w=800&auto=format&fit=crop',
                specs: ['5 перьев', 'Чернила', 'Специальная бумага'],
                location: 'Тамбов, центр'
            }),
            createOffer({
                title: 'Термос 1 литр',
                desc: 'Стеклянная колба, держит тепло 12 часов. Обмен на кухонную утварь.',
                category: 'Дом',
                owner: 'Игорь',
                likes: 6,
                img: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?q=80&w=800&auto=format&fit=crop',
                specs: ['Объём 1 л', 'Стеклянная колба', 'Держит 12 часов'],
                location: 'Курган, центр'
            }),
            createOffer({
                title: 'Набор для шахмат',
                desc: 'Деревянные фигуры, складная доска. Обмен на настольные игры.',
                category: 'Развлечения',
                owner: 'Борис',
                likes: 16,
                img: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?q=80&w=800&auto=format&fit=crop',
                specs: ['Деревянные фигуры', 'Складная доска', 'Чехол в комплекте'],
                location: 'Севастополь, центр'
            })
        ];

        // Демо запросы для правой панели
        requests = [
            { id: nanoid(), title: 'Нужен детский стульчик', owner: 'Марина', note: 'до 2 лет' },
            { id: nanoid(), title: 'Ищу книги по программированию', owner: 'Алексей', note: 'Python, JavaScript' },
            { id: nanoid(), title: 'Нужна зимняя куртка 48 размер', owner: 'Игорь', note: 'мужская' },
            { id: nanoid(), title: 'Ищу набор инструментов', owner: 'Сергей', note: 'для домашнего ремонта' },
            { id: nanoid(), title: 'Нужен детский велосипед', owner: 'Анна', note: '16 дюймов, рост 110-130 см' },
            { id: nanoid(), title: 'Ищу микроволновую печь', owner: 'Олег', note: 'мощность от 800W' },
            { id: nanoid(), title: 'Нужен компьютерный стол', owner: 'Виктор', note: 'ширина от 120 см' },
            { id: nanoid(), title: 'Ищу гитару для начинающих', owner: 'Михаил', note: 'акустическая' }
        ];

        // Демо истории для правой панели
        stories = [
            { id: nanoid(), text: 'Мария обменяла книги на детскую одежду для сына.' },
            { id: nanoid(), text: 'Сергей нашёл через обмен инструменты для ремонта.' },
            { id: nanoid(), text: 'Ольга получила набор посуды в обмен на старый фотоаппарат.' },
            { id: nanoid(), text: 'Андрей поменял зимние шины на набор инструментов.' },
            { id: nanoid(), text: 'Елена обменяла швейную машину на материалы для вязания.' },
            { id: nanoid(), text: 'Дмитрий получил книги по программированию в обмен на настольную игру.' }
        ];

        // Сохраняем в localStorage
        saveDataToStorage();
    }

    function createOffer({title, desc, category, owner, likes=0, img='', specs=[], location=''}) {
        return {
            id: nanoid(),
            title,
            desc,
            category,
            owner,
            likes,
            img,
            specs,
            location,
            createdAt: new Date().toISOString(),
            isUserAdded: false
        };
    }

    // Сохранение данных
    function saveDataToStorage() {
        try {
            localStorage.setItem('offers', JSON.stringify(offers));
            localStorage.setItem('requests', JSON.stringify(requests));
            localStorage.setItem('stories', JSON.stringify(stories));
            localStorage.setItem('conversations', JSON.stringify(conversations));
        } catch (e) {
            console.error('Error saving data:', e);
        }
    }

    // Загрузка данных
    function loadDataFromStorage() {
        try {
            const savedOffers = localStorage.getItem('offers');
            const savedRequests = localStorage.getItem('requests');
            const savedStories = localStorage.getItem('stories');
            const savedConversations = localStorage.getItem('conversations');

            if (savedOffers) offers = JSON.parse(savedOffers);
            if (savedRequests) requests = JSON.parse(savedRequests);
            if (savedStories) stories = JSON.parse(savedStories);
            if (savedConversations) conversations = JSON.parse(savedConversations);
        } catch (e) {
            console.error('Error loading data:', e);
            seed(); // Если ошибка, загружаем демо данные
        }
    }

    // Рендер товаров с пагинацией
    function renderOffers(list = offers) {
        if (!listEl) return;

        listEl.innerHTML = '';
        if (list.length === 0) {
            emptyEl.hidden = false;
            return;
        }
        emptyEl.hidden = true;

        // Ограничиваем показ до 30 товаров за раз для производительности
        const displayList = list.slice(0, 30);

        displayList.forEach(o => {
            const node = offerTpl.content.cloneNode(true);
            const card = node.querySelector('.card');
            const img = node.querySelector('.item-img');
            const title = node.querySelector('.title');
            const desc = node.querySelector('.desc');
            const specsEl = node.querySelector('.specs');
            const category = node.querySelector('.category');
            const owner = node.querySelector('.owner');
            const locationEl = node.querySelector('.location');
            const likes = node.querySelector('.likes');
            const swapBtn = node.querySelector('.swap-btn');
            const saveBtn = node.querySelector('.save-btn');

            // Заполнение данных
            title.textContent = o.title;
            desc.textContent = o.desc;
            category.textContent = o.category;
            owner.textContent = o.owner;
            likes.textContent = o.likes;

            // Характеристики
            specsEl.innerHTML = '';
            if (Array.isArray(o.specs) && o.specs.length) {
                o.specs.slice(0, 4).forEach(s => {
                    const li = document.createElement('li');
                    li.textContent = s;
                    specsEl.appendChild(li);
                });
            }

            // Местоположение
            if (o.location) {
                locationEl.textContent = `Местоположение: ${o.location}`;
            } else {
                locationEl.textContent = '';
            }

            // Изображение
            img.src = o.img || 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=800&auto=format&fit=crop';
            img.alt = o.title;

            // Клик по карточке
            card.dataset.id = o.id;
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                if (e.target.closest('button')) return;
                openProductDetail(o);
            });

            // Кнопки
            swapBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openExchangeModal(o);
            });

            saveBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleSave(o, card);
            });

            listEl.appendChild(node);
        });

        updateItemsCounter(list.length);

        // Добавляем сообщение если товаров больше 30
        if (list.length > 30) {
            const moreMsg = document.createElement('div');
            moreMsg.className = 'more-message';
            moreMsg.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 20px; color: var(--muted);';
            moreMsg.innerHTML = `<p>Показано 30 из ${list.length} товаров. Используйте поиск для уточнения результатов.</p>`;
            listEl.appendChild(moreMsg);
        }
    }

    // Обновление счетчика
    function updateItemsCounter(count) {
        let counterEl = document.getElementById('items-counter');
        if (!counterEl) {
            const toolbar = document.querySelector('.toolbar');
            if (toolbar) {
                counterEl = document.createElement('div');
                counterEl.id = 'items-counter';
                counterEl.style.cssText = 'font-size: 14px; color: var(--muted); margin-top: 5px;';
                toolbar.appendChild(counterEl);
            }
        }
        if (counterEl) {
            counterEl.textContent = `Найдено товаров: ${count}`;
        }
    }

    // Рендер запросов в правой панели
    function renderRequests() {
        if (!requestsEl) return;

        requestsEl.innerHTML = '';
        requests.forEach(r => {
            const el = document.createElement('div');
            el.className = 'request-item';
            el.dataset.id = r.id;
            el.innerHTML = `<strong>${r.title}</strong><br><small>${r.owner} • ${r.note}</small>`;

            el.addEventListener('click', () => {
                searchForRequest(r);
            });

            requestsEl.appendChild(el);
        });
    }

    // Рендер историй в правой панели
    function renderStories() {
        if (!storiesEl) return;

        storiesEl.innerHTML = '';
        stories.forEach(s => {
            const el = document.createElement('div');
            el.className = 'story-item';
            el.textContent = s.text;
            storiesEl.appendChild(el);
        });
    }

    // Поиск по запросу
    function searchForRequest(request) {
        const searchInput = document.getElementById('search');
        if (searchInput) {
            searchInput.value = request.title;
            searchInput.dispatchEvent(new Event('input'));
        }

        showNotification(`Ищем предложения для: "${request.title}"`);
    }

    // Сохранение товара
    function toggleSave(offer, card) {
        card.classList.toggle('saved');
        const saved = card.classList.contains('saved');
        offer.saved = saved;

        try {
            const store = JSON.parse(localStorage.getItem('savedOffers') || '[]');
            if (saved) {
                if (!store.includes(offer.id)) store.push(offer.id);
            } else {
                const idx = store.indexOf(offer.id);
                if (idx !== -1) store.splice(idx, 1);
            }
            localStorage.setItem('savedOffers', JSON.stringify(store));

            showNotification(saved ? 'Товар сохранён' : 'Товар удалён из сохранённых');
        } catch (e) {
            console.error('Error saving offer:', e);
        }

        if (saved) {
            card.style.boxShadow = '0 14px 40px rgba(245, 160, 137, 0.15)';
        } else {
            card.style.boxShadow = '';
        }
    }

    // Модальное окно обмена
    function openExchangeModal(offer) {
        const root = document.getElementById('modal-root');
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        backdrop.innerHTML = `
            <div class="modal" role="dialog" aria-modal="true">
                <h3>Предложить обмен — ${escapeHtml(offer.title)}</h3>
                <p style="color:var(--muted); margin-bottom: 20px;">Обмен — шанс помочь друг другу. Укажите, что вы можете предложить взамен.</p>
                <div class="form-row">
                    <input class="input" id="my-title" placeholder="Что вы предлагаете (коротко)"/>
                    <input class="input" id="my-cat" placeholder="Категория"/>
                </div>
                <div style="margin-bottom:10px;">
                    <textarea id="my-desc" placeholder="Расскажите почему это будет полезно..." rows="4"></textarea>
                </div>
                <div class="modal-actions">
                    <button id="cancel" class="save-btn">Отмена</button>
                    <button id="send" class="primary">Отправить предложение</button>
                </div>
            </div>
        `;
        root.appendChild(backdrop);

        function close() { backdrop.remove(); }

        backdrop.querySelector('#cancel').addEventListener('click', close);
        backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });

        backdrop.querySelector('#send').addEventListener('click', () => {
            const t = backdrop.querySelector('#my-title').value.trim();
            const c = backdrop.querySelector('#my-cat').value.trim() || 'Разное';
            const d = backdrop.querySelector('#my-desc').value.trim();
            if (!t) {
                backdrop.querySelector('#my-title').style.outline = '2px solid #f5c6c6';
                backdrop.querySelector('#my-title').focus();
                return;
            }

            showNotification('Ваше предложение отправлено!');
            close();
        });
    }

    // Открытие детальной страницы товара
    function openProductDetail(product) {
        showNotification(`Открываем детальную страницу: ${product.title}`);
        // Здесь будет переход на страницу товара
        window.showPage('product-page');

        // Заполняем данные товара
        document.getElementById('p-title').textContent = product.title;
        document.getElementById('p-short').textContent = product.title;
        document.getElementById('p-img').src = product.img || 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=800&auto=format&fit=crop';
        document.getElementById('p-category').textContent = product.category + (product.likes ? ` • ${product.likes} ♥` : '');
        document.getElementById('p-desc').textContent = product.desc;
        document.getElementById('seller-name').textContent = product.owner || 'Продавец';
        document.getElementById('seller-score').textContent = 'Доверие: 4.7 • 52 сделки';
        document.getElementById('seller-meta').textContent = `Категория: ${product.category || '—'}`;

        // Email продавца
        const email = product.owner ? `${product.owner.toLowerCase().replace(/\s+/g,'')}@example.com` : 'hello@example.com';
        const emailEl = document.getElementById('seller-email');
        emailEl.textContent = email;
        emailEl.href = `mailto:${email}`;
    }

    // Добавление нового товара
    function openAddProductModal() {
        const root = document.getElementById('modal-root');
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        backdrop.innerHTML = `
            <div class="modal" role="dialog" aria-modal="true" style="max-width: 600px;">
                <h3 style="color: #331B15;">➕ Добавить новый товар</h3>
                <p style="color: var(--muted); margin-bottom: 20px;">Заполните информацию о товаре</p>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #331B15;">Название товара *</label>
                    <input class="input" id="add-title" placeholder="Например: Книга 'Мастер и Маргарита'" />
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #331B15;">Категория *</label>
                    <select class="input" id="add-category">
                        <option value="">Выберите категорию</option>
                        <option value="Книги">Книги</option>
                        <option value="Одежда">Одежда</option>
                        <option value="Техника">Техника</option>
                        <option value="Дом">Дом</option>
                        <option value="Мебель">Мебель</option>
                        <option value="Детское">Детское</option>
                        <option value="Спорт">Спорт</option>
                        <option value="Инструменты">Инструменты</option>
                        <option value="Развлечения">Развлечения</option>
                        <option value="Коллекции">Коллекции</option>
                        <option value="Другое">Другое</option>
                    </select>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #331B15;">Описание товара *</label>
                    <textarea class="input" id="add-desc" placeholder="Опишите состояние товара, что вы хотите получить взамен..." rows="4"></textarea>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #331B15;">Ваше имя *</label>
                    <input class="input" id="add-owner" placeholder="Как к вам обращаться" />
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #331B15;">Местоположение</label>
                    <input class="input" id="add-location" placeholder="Город, район или метро" />
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #331B15;">Характеристики (через запятую)</label>
                    <input class="input" id="add-specs" placeholder="Например: 200 стр., твердый переплет, отличное состояние" />
                </div>

                <div class="modal-actions" style="margin-top: 30px;">
                    <button id="cancel-add" class="save-btn" style="margin-right: 10px;">Отмена</button>
                    <button id="submit-add" class="primary">Добавить товар</button>
                </div>
            </div>
        `;

        root.appendChild(backdrop);

        function close() { backdrop.remove(); }

        backdrop.querySelector('#cancel-add').addEventListener('click', close);
        backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });

        backdrop.querySelector('#submit-add').addEventListener('click', () => {
            const title = backdrop.querySelector('#add-title').value.trim();
            const category = backdrop.querySelector('#add-category').value;
            const desc = backdrop.querySelector('#add-desc').value.trim();
            const owner = backdrop.querySelector('#add-owner').value.trim();
            const location = backdrop.querySelector('#add-location').value.trim();
            const specsInput = backdrop.querySelector('#add-specs').value.trim();

            if (!title) {
                showNotification('Пожалуйста, укажите название товара');
                backdrop.querySelector('#add-title').focus();
                return;
            }

            if (!category) {
                showNotification('Пожалуйста, выберите категорию');
                backdrop.querySelector('#add-category').focus();
                return;
            }

            if (!desc) {
                showNotification('Пожалуйста, добавьте описание товара');
                backdrop.querySelector('#add-desc').focus();
                return;
            }

            if (!owner) {
                showNotification('Пожалуйста, укажите ваше имя');
                backdrop.querySelector('#add-owner').focus();
                return;
            }

            const specs = specsInput ? specsInput.split(',').map(s => s.trim()).filter(s => s) : [];

            const newOfferData = {
                title,
                desc,
                category,
                owner,
                likes: 0,
                img: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=800&auto=format&fit=crop',
                specs,
                location: location || 'Не указано'
            };

            const newOffer = createOffer(newOfferData);
            offers.unshift(newOffer);
            saveDataToStorage();
            renderOffers();
            close();
            showNotification(`Товар "${title}" успешно добавлен!`);
        });
    }

    // Уведомления
    function showNotification(text) {
        const n = document.createElement('div');
        n.style.cssText = `
            position: fixed;
            right: 18px;
            bottom: 18px;
            background: var(--primary-bg);
            color: var(--primary-text);
            padding: 12px 16px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            z-index: 9999;
            font-weight: 500;
            font-size: 14px;
            max-width: 300px;
            transform: translateY(20px);
            opacity: 0;
            transition: transform 0.3s, opacity 0.3s;
        `;
        n.textContent = text;
        document.body.appendChild(n);

        setTimeout(() => {
            n.style.transform = 'translateY(0)';
            n.style.opacity = '1';
        }, 10);

        setTimeout(() => {
            n.style.transform = 'translateY(20px)';
            n.style.opacity = '0';
            setTimeout(() => n.remove(), 300);
        }, 3000);
    }

    // Экранирование HTML
    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, function(c) {
            return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
        });
    }

    // Привязка событий
    function bind() {
        // Кнопка добавления товара
        const newOfferBtn = document.getElementById('new-offer-btn');
        if (newOfferBtn) {
            newOfferBtn.addEventListener('click', openAddProductModal);
        }

        // Кнопка сохранённых
        const savedBtn = document.getElementById('saved-btn');
        if (savedBtn) {
            savedBtn.addEventListener('click', () => {
                try {
                    const savedIds = JSON.parse(localStorage.getItem('savedOffers') || '[]');
                    const savedOffers = offers.filter(o => savedIds.includes(o.id));

                    if (savedOffers.length === 0) {
                        showNotification('У вас пока нет сохранённых товаров');
                        renderOffers(offers);
                    } else {
                        renderOffers(savedOffers);
                        showNotification(`Показано сохранённых товаров: ${savedOffers.length}`);
                    }
                } catch (e) {
                    showNotification('Ошибка загрузки сохранённых товаров');
                }
            });
        }

        // Поиск
        const searchInput = document.getElementById('search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const q = e.target.value.trim().toLowerCase();
                if (!q) {
                    renderOffers(offers);
                    return;
                }
                const filtered = offers.filter(o =>
                    (o.title + ' ' + o.desc + ' ' + o.category).toLowerCase().includes(q)
                );
                renderOffers(filtered);
            });
        }

        // Глобальный поиск
        const globalSearch = document.getElementById('global-search');
        if (globalSearch) {
            globalSearch.addEventListener('input', (e) => {
                const q = e.target.value.trim().toLowerCase();
                if (!q) {
                    renderOffers(offers);
                    return;
                }
                const filtered = offers.filter(o =>
                    (o.title + ' ' + o.desc + ' ' + o.category + ' ' + o.owner).toLowerCase().includes(q)
                );
                renderOffers(filtered);
            });
        }

        // Кнопки сообщества
        const howBtn = document.getElementById('how-btn');
        if (howBtn) {
            howBtn.addEventListener('click', () => {
                showNotification('Обмен — предложение вещи + честное описание. Обсуждайте обмен в личных сообщениях.');
            });
        }

        const joinBtn = document.getElementById('join-btn');
        if (joinBtn) {
            joinBtn.addEventListener('click', () => {
                showNotification('Вы присоединились к сообществу! Поздравляем.');
            });
        }

        // Сортировка
        const sortSelect = document.getElementById('sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                const v = e.target.value;
                let sorted = [...offers];

                if (v === 'new') {
                    sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                } else if (v === 'popular') {
                    sorted.sort((a, b) => b.likes - a.likes);
                } else if (v === 'match') {
                    sorted.sort((a, b) => b.likes - a.likes);
                }

                renderOffers(sorted);
            });
        }

        // Фильтр категорий
        const categorySelect = document.getElementById('category');
        if (categorySelect) {
            categorySelect.addEventListener('change', (e) => {
                const v = e.target.value;
                if (!v) {
                    renderOffers(offers);
                } else {
                    const filtered = offers.filter(o => o.category === v);
                    renderOffers(filtered);
                }
            });
        }

        // Флаг "Только поблизости"
        const nearbyCheckbox = document.getElementById('nearby');
        if (nearbyCheckbox) {
            nearbyCheckbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    showNotification('Показываем только ближайшие предложения');
                    const filtered = offers.filter(o => o.location.includes('Москва') || o.location.includes('м.'));
                    renderOffers(filtered);
                } else {
                    renderOffers(offers);
                }
            });
        }

        // Авторизация
        const doLogin = document.getElementById('do-login');
        if (doLogin) {
            doLogin.addEventListener('click', () => {
                const name = document.getElementById('login-name').value.trim();
                const email = document.getElementById('login-email').value.trim();

                if (!name) {
                    showNotification('Пожалуйста, введите имя');
                    return;
                }

                const profile = {
                    name: name,
                    email: email || '',
                    score: 4.8,
                    deals: Math.floor(Math.random() * 20) + 1
                };
                localStorage.setItem('profile', JSON.stringify(profile));

                // Обновляем UI
                document.getElementById('user-name').textContent = profile.name;
                document.getElementById('user-score').textContent = `Доверие: ${profile.score}`;
                document.getElementById('acc-name').textContent = profile.name;
                document.getElementById('input-name').value = profile.name;
                document.getElementById('acc-email').textContent = profile.email || 'email@example.com';
                document.getElementById('input-email').value = profile.email || '';
                document.getElementById('acc-score').textContent = `Доверие: ${profile.score} • ${profile.deals} сделок`;

                showNotification(`Добро пожаловать, ${profile.name}!`);
                window.showPage('main-page');
            });
        }

        // Регистрация
        const doRegister = document.getElementById('do-register');
        if (doRegister) {
            doRegister.addEventListener('click', () => {
                const name = document.getElementById('reg-name').value.trim();
                const email = document.getElementById('reg-email').value.trim();
                const pass = document.getElementById('reg-pass').value;

                if (!name) {
                    showNotification('Пожалуйста, введите имя');
                    return;
                }

                const profile = {
                    name: name,
                    email: email || '',
                    score: 4.8,
                    deals: 0
                };
                localStorage.setItem('profile', JSON.stringify(profile));

                // Обновляем UI
                document.getElementById('user-name').textContent = profile.name;
                document.getElementById('user-score').textContent = `Доверие: ${profile.score}`;
                document.getElementById('acc-name').textContent = profile.name;
                document.getElementById('input-name').value = profile.name;
                document.getElementById('acc-email').textContent = profile.email || 'email@example.com';
                document.getElementById('input-email').value = profile.email || '';
                document.getElementById('acc-score').textContent = `Доверие: ${profile.score} • ${profile.deals} сделок`;

                showNotification(`Аккаунт создан, ${profile.name}!`);
                window.showPage('main-page');
            });
        }

        // Сохранение профиля
        const saveProfile = document.getElementById('save-profile');
        if (saveProfile) {
            saveProfile.addEventListener('click', () => {
                const name = document.getElementById('input-name').value.trim();
                const email = document.getElementById('input-email').value.trim();

                const profile = JSON.parse(localStorage.getItem('profile') || '{}');
                profile.name = name || 'Аноним';
                profile.email = email || '';

                localStorage.setItem('profile', JSON.stringify(profile));

                // Обновляем UI
                document.getElementById('user-name').textContent = profile.name;
                document.getElementById('acc-name').textContent = profile.name;
                document.getElementById('acc-email').textContent = profile.email || 'email@example.com';

                showNotification('Профиль сохранён');
            });
        }

        // Выход
        const logoutBtn = document.getElementById('logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('profile');
                document.getElementById('user-name').textContent = 'Гость';
                document.getElementById('user-score').textContent = 'Доверие: 0.0';
                document.getElementById('acc-name').textContent = 'Гость';
                document.getElementById('acc-email').textContent = 'email@example.com';
                document.getElementById('acc-score').textContent = 'Доверие: 0.0 • 0 сделок';
                showNotification('Вы вышли из системы');
                window.showPage('main-page');
            });
        }
    }

    // Инициализация
    function init() {
        loadDataFromStorage();
        if (offers.length === 0) {
            seed();
        }

        bind();
        renderOffers();
        renderRequests();
        renderStories();

        // Загрузка профиля
        const profile = JSON.parse(localStorage.getItem('profile') || '{}');
        if (profile.name) {
            document.getElementById('user-name').textContent = profile.name;
            document.getElementById('user-score').textContent = `Доверие: ${profile.score || '4.4'}`;
            document.getElementById('acc-name').textContent = profile.name;
            document.getElementById('input-name').value = profile.name;
            document.getElementById('acc-email').textContent = profile.email || 'email@example.com';
            document.getElementById('input-email').value = profile.email || '';
            document.getElementById('acc-score').textContent = `Доверие: ${profile.score || '0.0'} • ${profile.deals || 0} сделок`;
        }
    }

    return { init };
})();

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => app.init());