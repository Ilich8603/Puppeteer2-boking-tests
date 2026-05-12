const { clickElement, getText } = require("../lib/commands.js");

let page;

beforeEach(async () => {
    page = await browser.newPage();  
    await page.setDefaultNavigationTimeout(10000);
    await page.goto('http://qamid.tmweb.ru/client/index.php', {
    });
    
});

afterEach(() => {
    page.close();
});

describe("Happy path", () => {
  
    test('Booking one ticket', async () => {
        
        await clickElement(page, '.page-nav__day:nth-child(2)'); // 2-й элемент в навигации
        // 2. Выбор сеанса по data-seance-id
        await clickElement(page, '.movie-seances__time[data-seance-id="217"]');
        
        // Ожидание загрузки схемы зала
        await page.waitForSelector('.buying-scheme', { timeout: 10000 });
        
        // 3. Выбор стандартного свободного места
        await clickElement(page, '.buying-scheme__chair_standart');
        
        // 4. Нажатие кнопки "Забронировать"
        await clickElement(page, '.acceptin-button');
        
        // 5. Проверка подтверждения с названием фильма
        const movieTitle = await getText(page, '.ticket__details.ticket__title');
        expect(movieTitle).toContain('Сталкер(1979)');
        }, 20000);

      
    test('Booking some tickets', async () => {
        await clickElement(page, 'a:nth-child(5)');
  
        await clickElement(page, `.movie-seances__time[data-seance-id="225"]`);
        
        await page.waitForSelector('.buying-scheme', { timeout: 10000 });
        
        
        await clickElement(page, '.buying-scheme__row:nth-child(10) .buying-scheme__chair_vip:nth-child(2)');
        await clickElement(page, '.buying-scheme__row:nth-child(10) .buying-scheme__chair_vip:nth-child(3)');
        await clickElement(page, '.buying-scheme__row:nth-child(10) .buying-scheme__chair_vip:nth-child(4)');
                
        await clickElement(page, '.acceptin-button');
    
        const movieTitle = await getText(page, '.ticket__details.ticket__title');
        expect(movieTitle).toContain('Ведьмак');

        const chairsText = await getText(page, '.ticket__details.ticket__chairs');
        expect(chairsText.split(',').length).toBe(3);
    }, 30000);


       
    test('Попытка бронирования занятого места (sad path)', async () => {
        
        await clickElement(page, 'a:nth-child(6)');
        
        await clickElement(page, `.movie-seances__time[data-seance-id="240"]`);
        
        await page.waitForSelector('.buying-scheme', { timeout: 5000 });
        
        // 3. Попытка выбрать уже занятое место
        await clickElement(page, '.buying-scheme__chair_taken');
        
        // 4. Проверка, что кнопка "Забронировать" неактивна
        const button = await page.$('.acceptin-button');
        const isDisabled = await button.evaluate((btn) => btn.disabled);
        expect(isDisabled).toBe(true);
        }, 20000);
});