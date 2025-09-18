"use client";

import React from "react";

const About = () => {
  return (
    <div>
      <section
        className="relative w-full h-[30vh] bg-cover bg-center"
        style={{ backgroundImage: "url(https://via.placeholder.com/1920x400?text=About+Us+Banner)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">За нас</h1>
          <p className="max-w-[900px] md:text-xl/relaxed mt-2 text-gray-200">
            Вашият надежден партньор за денонощна пътна помощ и автосервиз.
          </p>
        </div>
      </section>
      <div className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto text-muted-foreground space-y-8 text-lg">
          <h2 className="text-3xl font-bold text-center text-primary-foreground sm:text-4xl">
            🚨 Вашият надежден партньор за 24/7 пътна помощ и автосервиз (до 4,5 тона)
          </h2>
          <p className="text-center text-xl leading-relaxed">
            Ние сме вашият доверен партньор за денонощна пътна помощ и професионален автосервиз. С дългогодишен опит, екип от специалисти и модерно оборудване, предлагаме бърза и ефективна реакция при всякакви пътни инциденти – 24 часа в денонощието, 7 дни в седмицата.
          </p>
          <p className="text-center text-xl leading-relaxed font-medium">
            Независимо дали сте аварирали в града, на магистралата или в отдалечен район, ние сме винаги готови да реагираме навреме и професионално.
          </p>

          <h3 className="text-2xl font-bold text-primary-foreground mt-10 mb-4 flex items-center gap-2">
            <span className="text-primary">🛠️</span> Нашите услуги
          </h3>
          <ul className="space-y-4 pl-6">
            <li className="flex items-start gap-3">
              <span className="text-primary text-2xl">🚗</span>
              <div>
                <strong className="text-xl text-foreground">Репатриране на автомобили и бусове</strong>
                <p className="text-base">Сигурен и надежден транспорт до 4,5 тона – както на близки, така и на дълги разстояния.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-2xl">🛞</span>
              <div>
                <strong className="text-xl text-foreground">Смяна и ремонт на гуми на пътя</strong>
                <p className="text-base">Спукана гума или липса на резервна? Осигуряваме ремонт, доставка и монтаж директно на място.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-2xl">🔋</span>
              <div>
                <strong className="text-xl text-foreground">Подаване на ток</strong>
                <p className="text-base">Изтощен акумулатор? Нашият екип ще ви осигури професионален старт, за да продължите пътуването си.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-2xl">⛽</span>
              <div>
                <strong className="text-xl text-foreground">Доставка на гориво</strong>
                <p className="text-base">Останахте без гориво? Ние ще ви доставим необходимото количество, за да стигнете безопасно до целта си.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-2xl">🛠️</span>
              <div>
                <strong className="text-xl text-foreground">Транспорт до доверен сервиз</strong>
                <p className="text-base">Ако повредата не може да се отстрани на място, ще превозим автомобила ви до нашия сервиз или избран от вас партньор.</p>
              </div>
            </li>
          </ul>

          <h3 className="text-2xl font-bold text-primary-foreground mt-10 mb-4 flex items-center gap-2">
            <span className="text-primary">🏢</span> Наш собствен автосервиз
          </h3>
          <p className="text-lg leading-relaxed">
            Освен пътна помощ, разполагаме и със собствен професионален сервиз в Разград, където предлагаме:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-6">
            <li className="text-foreground text-lg">🔧 Компютърна диагностика</li>
            <li className="text-foreground text-lg">⚙️ Ремонт на двигатели и скоростни кутии</li>
            <li className="text-foreground text-lg">🛑 Ремонт на спирачни и ходови системи</li>
            <li className="text-foreground text-lg">💡 Отстраняване на проблеми в електрическата система</li>
            <li className="text-foreground text-lg">🚐 Обслужване на леки и лекотоварни автомобили</li>
          </ul>

          <h3 className="text-2xl font-bold text-primary-foreground mt-10 mb-4 flex items-center gap-2">
            <span className="text-primary">🎯</span> Нашата мисия
          </h3>
          <p className="text-lg leading-relaxed">
            Нашата цел е да ви осигурим:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-6">
            <li className="text-foreground text-lg">⚡ <strong className="text-primary">Бърза реакция</strong> – когато всяка минута е важна</li>
            <li className="text-foreground text-lg">⭐ <strong className="text-primary">Качествено обслужване</strong> – на което може да разчитате</li>
            <li className="text-foreground text-lg">🛡️ <strong className="text-primary">Спокойствие на пътя</strong> – независимо къде се намирате</li>
          </ul>
          <p className="text-lg leading-relaxed">
            Ние гарантираме конкурентни цени, коректност и индивидуален подход към всеки клиент.
          </p>
          <p className="text-xl font-semibold text-primary text-center mt-8">
            ✅ Доверете се на професионалистите – Вашата пътна помощ и автосервиз – винаги до вас!
          </p>
        </div>
      </div>
    </div>
  );
};
export default About;