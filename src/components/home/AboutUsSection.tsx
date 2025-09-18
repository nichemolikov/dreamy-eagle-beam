import React from "react";

const AboutUsSection = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">За нас</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Ние сме вашият надежден партньор за денонощна пътна помощ и автосервиз до 4,5 тона.
            С дългогодишен опит, екип от професионалисти и модерно оборудване, предлагаме бърза и ефективна помощ при всякакви пътни инциденти – 24 часа в денонощието, 7 дни в седмицата.
          </p>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Независимо дали сте аварирали в града или на магистралата, ние сме винаги на разположение. Нашите услуги включват:
          </p>
          <ul className="list-disc list-inside text-left max-w-[900px] text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed space-y-2">
            <li>Репатриране на автомобили и бусове до 4,5 тона</li>
            <li>Смяна на гума на пътя</li>
            <li>Подаване на ток</li>
            <li>Доставка на гориво</li>
            <li>Транспорт до доверен автосервиз</li>
          </ul>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Разполагаме и със собствен автосервиз, където предлагаме пълна диагностика, ремонт на двигатели, спирачки, окачване, електрически системи и други. Работим както с леки, така и с лекотоварни автомобили.
          </p>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Нашата мисия е да ви осигурим бърза реакция, качествено обслужване и спокойствие на пътя. Гарантираме конкурентни цени, коректност и индивидуален подход към всеки клиент.
          </p>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-semibold">
            Доверете се на професионалистите – Вашата пътна помощ и автосервиз – винаги до вас!
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;