# Context for Robotics Website

## Project Requirements (Russian Language Website)

Создать высокотехнологичный сайт о робототехнике "PROроботов" с полной админ-панелью.

### Design Requirements
- **Цветовая схема**: светло-голубой, темно-синий, серебристый, золотой
- **Главная страница**: 
  - Анимированные плитки с названиями рубрик
  - Фоновая анимация: большие вращающиеся шестеренки, сцепляющиеся между собой
  - Логотип "PROроботов" вверху слева (logo.png)
  - По одному ряду контента из каждой рубрики
  - Навигация вверху и внизу
  - Кнопка регистрации
- **Нет классической шапки и подвала** - только навигация

### Sections (Рубрики)
1. **Новости (News)** - новости робототехники с медиа (фото/видео)
2. **Каталог роботов (Robot Catalog)** - карточки роботов
3. **FAQ** - часто задаваемые вопросы
4. **DIY** - проекты своими руками
5. **Место встречи (Meeting Place)** - чат для зарегистрированных пользователей

### Features
- **Регистрация через email** (на главной странице и в Место встречи)
- **Админ-панель** с доступом к:
  - База зарегистрированных пользователей (редактирование)
  - Публикация и редактирование новостей (с медиа)
  - Создание и редактирование карточек каталога роботов
  - Редактирование FAQ и DIY страниц
  - Модерация чата
  - **АВТОМАТИЧЕСКАЯ ПУБЛИКАЦИЯ НОВОСТЕЙ** из ~20 авторитетных источников (переведенных на русский язык)

### Robot Catalog Card Structure
- Название робота
- Сфера применения
- Краткое описание
- Стоимость
- Ссылка на официальный сайт

### Initial Content
Контент из файла /home/user/robotics_research.md

### Available Images (in /public/)
- logo.png - логотип сайта "PROроботов"
- spot-robot.png - Boston Dynamics Spot
- cobot-arm.png - Коллаборативный робот-манипулятор
- agricultural-drone.png - Сельскохозяйственный дрон
- robot-vacuum.png - Робот-пылесос
- humanoid-service-robot.png - Гуманоидный сервисный робот
- diy-robot-arm.png - DIY робот-манипулятор Arduino
- line-follower-robot.png - Робот, следующий по линии
- diy-cleaning-robot.png - DIY робот-пылесос Raspberry Pi

### Technical Requirements
- Authentication with Better Auth + Admin plugin (RBAC)
- Chat functionality (realtime for registered users)
- Admin panel with full CRUD operations
- Automated news fetching from multiple sources (translated to Russian)
- Responsive design
- Animated background (gears animation CSS/Canvas)
- Smooth animations for homepage tiles
