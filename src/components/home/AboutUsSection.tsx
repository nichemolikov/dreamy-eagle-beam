import React from "react";

const AboutUsSection = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">За нас</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Вашият надежден партньор за 24/7 пътна помощ и автосервиз (до 4,5 тона)
          </p>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            С дългогодишен опит, екип от професионалисти и модерно оборудване, ние предлагаме бърза и ефективна помощ при всякакви пътни инциденти – 24 часа в денонощието, 7 дни в седмицата.
          </p>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Независимо дали сте аварирали в града или на магистралата – ние сме винаги на разположение.
          </p>

          <h3 className="text-2xl font-bold tracking-tighter sm:text-3xl mt-8">Нашите услуги</h3>
          <ul className="list-none text-left max-w-[900px] text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed space-y-2">
            <li>🚗 Репатриране на автомобили и бусове – до 4,5 тона</li>
            <li>🛞 Смяна на гума на пътя – бърз ремонт или монтаж на място</li>
            <li>🔋 Подаване на ток – надежден старт при изтощен акумулатор</li>
            <li>⛽ Доставка на гориво – когато останете на пътя без резерв</li>
            <li>🛠️ Транспорт до доверен сервиз – сигурен превоз до избран от вас автосервиз</li>
          </ul>

          <h3 className="text-2xl font-bold tracking-tighter sm:text-3xl mt-8">Собствен автосервиз</h3>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Разполагаме и със собствен професионален сервиз в гр. Разград, където предлагаме:
          </p>
          <ul className="list-disc list-inside text-left max-w-[900px] text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed space-y-2">
            <li>Пълна диагностика</li>
            <li>Ремонт на двигатели и скоростни кутии</li>
            <li>Ремонт на спирачки и окачване</li>
            <li>Отстраняване на проблеми в електрическата система</li>
            <li>Обслужване както на леки, така и на лекотоварни автомобили</li>
          </ul>

          <h3 className="text-2xl font-bold tracking-tighter sm:text-3xl mt-8">Нашата мисия</h3>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Да ви осигурим бърза реакция, качествено обслужване и спокойствие на пътя.
            Гарантираме конкурентни цени, коректност и индивидуален подход към всеки клиент.
          </p>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-semibold">
            ✅ Доверете се на професионалистите – Вашата пътна помощ и автосервиз – винаги до вас!
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;