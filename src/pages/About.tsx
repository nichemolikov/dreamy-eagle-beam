import React from "react";

const About = () => (
  <div>
    <section
      className="relative w-full h-[30vh] bg-cover bg-center"
      style={{ backgroundImage: "url(https://mertai.bg/wp-content/uploads/2025/09/viber_image_2025-07-29_13-43-45-541.jpg)" }}
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
      <div className="max-w-3xl mx-auto text-muted-foreground space-y-4 text-lg">
        <p>
          Ние сме вашият надежден партньор за денонощна пътна помощ и автосервиз до 4,5 тона.
          С дългогодишен опит, екип от професионалисти и модерно оборудване, предлагаме бърза и ефективна помощ при всякакви пътни инциденти – 24 часа в денонощието, 7 дни в седмицата.
        </p>
        <p>
          Независимо дали сте аварирали в града или на магистралата, ние сме винаги на разположение. Нашите услуги включват:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li>Репатриране на автомобили и бусове до 4,5 тона</li>
          <li>Смяна на гума на пътя</li>
          <li>Подаване на ток</li>
          <li>Доставка на гориво</li>
          <li>Транспорт до доверен автосервиз</li>
        </ul>
        <p>
          Разполагаме и със собствен автосервиз, където предлагаме пълна диагностика, ремонт на двигатели, спирачки, окачване, електрически системи и други. Работим както с леки, така и с лекотоварни автомобили.
        </p>
        <p>
          Нашата мисия е да ви осигурим бърза реакция, качествено обслужване и спокойствие на пътя. Гарантираме конкурентни цени, коректност и индивидуален подход към всеки клиент.
        </p>
        <p className="font-semibold text-primary">
          ✅ Доверете се на професионалистите – Вашата пътна помощ и автосервиз – винаги до вас!
        </p>
      </div>
    </div>
  </div>
);
export default About;