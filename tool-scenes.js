/* Geometric process illustrations. Progress is supplied by the page scroll. */
(() => {
  const clamp = p => Math.max(0, Math.min(1, Number(p) || 0));
  const at = (svg, name) => svg.querySelector(`[data-part="${name}"]`);
  const set = (svg, name, property, value) => at(svg, name).setAttribute(property, value);
  const shell = (name, contents) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" role="img" aria-label="${name}" fill="none" stroke="#edece6" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><style>text{font-family:inherit;stroke:none;font-size:20px;fill:#edece6}.measure{fill:#d7ff46;font-variant-numeric:tabular-nums}.quiet{stroke:#718078}.accent{stroke:#d7ff46}.surface{fill:#202724;stroke:#718078}.tool-body{fill:#141a18;stroke:#edece6;stroke-width:3}</style>${contents}</svg>`;
  window.toolScenes = [
    {
      id: 'estimate', title: 'Рассчитаем работы бесплатно', tool: 'Калькулятор стоимости',
      description: 'Расскажите об объекте и нужных работах — подготовим предварительный расчёт бесплатно. Стоимость ремонта определим по составу и объёму работ.',
      steps: ['Объём', 'Состав работ', 'Расчёт — 0 ₽'],
      svg: shell('Калькулятор считает позиции работ. Подготовка расчёта бесплатна — 0 рублей.', `
        <rect class="tool-body" x="66" y="35" width="206" height="277" rx="16"/>
        <rect x="83" y="54" width="172" height="68" rx="6" fill="#283321" class="quiet"/>
        <text data-part="digits" x="240" y="100" text-anchor="end" class="measure" style="font-size:36px">01</text>
        <g fill="#28302c" class="quiet">
          <rect x="85" y="143" width="44" height="40" rx="5"/><rect x="147" y="143" width="44" height="40" rx="5"/><rect x="209" y="143" width="44" height="40" rx="5"/>
          <rect x="85" y="195" width="44" height="40" rx="5"/><rect x="147" y="195" width="44" height="40" rx="5"/><rect x="209" y="195" width="44" height="40" rx="5"/>
          <rect x="85" y="247" width="106" height="44" rx="5"/><rect data-part="equals" x="209" y="247" width="44" height="44" rx="5"/>
        </g>
        <g text-anchor="middle"><text x="107" y="170">1</text><text x="169" y="170">2</text><text x="231" y="170">3</text><text x="107" y="222">4</text><text x="169" y="222">5</text><text x="231" y="222">6</text><text x="138" y="277">0</text><text x="231" y="277">=</text></g>
        <g data-part="items"><text x="310" y="77">01  Объём работ</text><path class="quiet" d="M310 95H543"/><text x="310" y="129">02  Материалы</text><path class="quiet" d="M310 147H543"/><text x="310" y="181">03  Этапы ремонта</text></g>
        <g data-part="total"><path class="accent" d="M310 209H543"/><text x="310" y="242">Подготовка расчёта</text><text class="measure" x="310" y="300" style="font-size:48px">0 ₽</text></g>
        <text x="300" y="346" text-anchor="middle">Бесплатный расчёт стоимости работ</text>`),
      update(svg, value) {
        const p = clamp(value);
        at(svg, 'digits').textContent = p < .78 ? String(1 + Math.min(2, Math.floor(p / .26))).padStart(2, '0') : '0 ₽';
        set(svg, 'items', 'opacity', .4 + .6 * p);
        set(svg, 'total', 'opacity', .35 + .65 * clamp((p - .55) / .23));
        set(svg, 'equals', 'fill', p >= .78 ? '#4f651d' : '#28302c');
      }
    },
    {
      id: 'level', title: 'Выводим горизонталь', tool: 'Пузырьковый уровень',
      description: 'Выравниваем инструмент. Пузырёк приходит точно между рисками — горизонталь найдена.',
      svg: shell('Пузырьковый уровень выравнивается, пузырёк встаёт по центру', `
        <path class="quiet" d="M58 231H542M58 241H542"/>
        <path class="accent" stroke-dasharray="4 7" d="M65 154H535"/>
        <g data-part="body" transform="rotate(-8 300 213)">
          <rect class="tool-body" x="76" y="168" width="448" height="60" rx="9"/>
          <path d="M91 176H509M91 220H509" class="quiet"/>
          <rect x="76" y="168" width="22" height="60" rx="5" fill="#333d36"/>
          <rect x="502" y="168" width="22" height="60" rx="5" fill="#333d36"/>
          <rect x="241" y="180" width="118" height="34" rx="17" fill="#d7ff46" stroke="#d7ff46"/>
          <path d="M287 181V213M313 181V213" stroke="#253014"/>
          <ellipse data-part="bubble" cx="274" cy="197" rx="11" ry="12" fill="#f5ffe0" stroke="#263514"/>
          <rect x="131" y="182" width="74" height="31" rx="15"/>
          <rect x="395" y="178" width="26" height="40" rx="10"/>
          <path d="M396 192H420M396 199H420" class="quiet"/>
          <circle cx="113" cy="199" r="3"/><circle cx="487" cy="199" r="3"/>
        </g>
        <path class="accent" d="M300 116V146M294 139L300 147L306 139"/>
        <text x="300" y="95" text-anchor="middle">Пузырёк — между рисками</text>
        <text data-part="angle" class="measure" x="300" y="288" text-anchor="middle" style="font-size:32px">8,0°</text>
        <text x="300" y="325" text-anchor="middle">Контроль горизонтали</text>`),
      update(svg, value) {
        const p = clamp(value), angle = 8 * (1 - p);
        set(svg, 'body', 'transform', `rotate(${-angle} 300 213)`);
        set(svg, 'bubble', 'cx', 274 + 26 * p);
        at(svg, 'angle').textContent = `${angle.toFixed(1).replace('.', ',')}°`;
      }
    },
    {
      id: 'spatula', title: 'Выравниваем стену', tool: 'Широкий шпатель',
      description: 'Широкое лезвие проходит по стене. За ним остаётся ровный слой, и след работы виден сразу.',
      svg: shell('Широкий шпатель снимает неровности и оставляет ровный слой', `
        <defs><clipPath id="spatula-smooth-clip"><rect data-part="smooth" x="96" y="81" width="0" height="172"/></clipPath></defs>
        <rect class="surface" x="82" y="70" width="436" height="198" rx="2"/>
        <g class="quiet"><path d="M101 99l24 9 26-15 32 13 26-9 31 9 28-11 26 16 27-9 24 6 31-16 29 15 21-4 29 9 21-13M101 132l23-8 31 17 22-8 32 7 29-15 29 17 27-13 30 8 27-15 22 20 33-9 21 7 27-15 27 12M101 168l29 10 20-17 28 7 29-9 29 14 30-7 21 9 29-17 32 15 25-11 29 11 23-5 31 9 18-14M101 206l25-13 25 15 22-5 36 8 25-14 24 5 26-10 28 16 28-8 29 11 25-17 30 8 23-6 26 13M101 242l27-14 20 8 32-7 27 9 32-14 28 15 23-7 28 13 25-11 28 3 25-10 26 11 28-9 26 10"/></g>
        <g clip-path="url(#spatula-smooth-clip)"><rect x="96" y="81" width="408" height="172" fill="#35432a" stroke="none"/><path class="accent" opacity=".65" d="M105 110H502M105 166H502M105 224H502"/></g>
        <g data-part="blade" transform="translate(0 0)">
          <path class="tool-body" d="M100 82L159 116V217L100 251Z"/>
          <path class="accent" stroke-width="4" d="M100 84V249"/>
          <path class="quiet" d="M111 95L149 121V212L111 238"/>
          <path d="M160 148H183V184H160" fill="#718078"/>
          <rect x="183" y="144" width="74" height="44" rx="12" class="tool-body"/>
          <path class="quiet" d="M194 151V180M205 151V180M216 151V180M227 151V180"/>
          <circle cx="243" cy="166" r="4"/>
        </g>
        <path class="accent" d="M111 305H189M181 298L189 305L181 312"/>
        <text x="211" y="312">Ровный слой за лезвием</text>`),
      update(svg, value) {
        const p = clamp(value);
        set(svg, 'blade', 'transform', `translate(${340 * p} 0)`);
        set(svg, 'smooth', 'width', 4 + 340 * p);
      }
    },
    {
      id: 'square', title: 'Проверяем прямой угол', tool: 'Столярный угольник',
      description: 'Прикладываем обе стороны угольника к стыку. Отметка 90° показывает, что проверяем именно угол.',
      svg: shell('Г-образный угольник прикладывается к стыку стен под 90 градусов', `
        <path class="surface" d="M162 65H188V258H502V283H162Z"/>
        <path stroke="#d7ff46" d="M188 65V258H502" stroke-dasharray="5 8"/>
        <g data-part="square" transform="translate(64 -26) rotate(9 200 247)">
          <path class="tool-body" d="M191 91H223V224H469V255H191Z"/>
          <path class="quiet" d="M200 105H215M200 120H210M200 135H215M200 150H210M200 165H215M200 180H210M200 195H215M200 210H210M240 234V247M255 237V247M270 234V247M285 237V247M300 234V247M315 237V247M330 234V247M345 237V247M360 234V247M375 237V247M390 234V247M405 237V247M420 234V247M435 237V247M450 234V247"/>
          <circle cx="207" cy="105" r="4"/>
          <path class="accent" d="M227 193H254V220" stroke-width="3"/>
        </g>
        <path class="accent" data-part="right-angle" d="M189 209H238V258" stroke-width="3" opacity=".2"/>
        <text x="336" y="137" class="measure" style="font-size:54px">90°</text>
        <text x="336" y="171">Прямой угол</text>
        <text x="300" y="328" text-anchor="middle">Две стороны плотно к стыку</text>`),
      update(svg, value) {
        const p = clamp(value);
        set(svg, 'square', 'transform', `translate(${64 * (1 - p)} ${-26 * (1 - p)}) rotate(${9 * (1 - p)} 200 247)`);
        set(svg, 'right-angle', 'opacity', .2 + .8 * p);
      }
    },
    {
      id: 'roller', title: 'Наносим финишный слой', tool: 'Малярный валик',
      description: 'Валик идёт по поверхности. Полоса покрытия растёт вслед за ним, показывая направление прохода.',
      svg: shell('Малярный валик движется снизу вверх, оставляя полосу покрытия', `
        <rect class="surface" x="84" y="45" width="316" height="250" rx="2"/>
        <path class="quiet" d="M98 62H384M98 279H384"/>
        <rect data-part="paint" x="163" y="222" width="151" height="0" fill="#d7ff46" stroke="none"/>
        <g data-part="roller" transform="translate(0 0)">
          <path d="M313 220H334V251Q334 263 322 263H257V292" stroke-width="7" stroke="#718078"/>
          <path d="M313 220H334V251Q334 263 322 263H257V292" stroke-width="2"/>
          <rect class="tool-body" x="156" y="202" width="162" height="36" rx="10"/>
          <rect x="163" y="204" width="148" height="32" rx="7" fill="#c3d697" stroke="none"/>
          <path d="M174 209L185 218L177 228M202 209L213 218L205 228M230 209L241 218L233 228M258 209L269 218L261 228M286 209L297 218L289 228" stroke="#60793c" stroke-width="2"/>
          <rect class="tool-body" x="245" y="289" width="24" height="54" rx="8"/>
          <path class="quiet" d="M251 300H263M251 310H263M251 320H263"/>
        </g>
        <path class="accent" d="M451 239V106M443 114L451 106L459 114"/>
        <text x="424" y="274">Снизу</text><text x="424" y="302">вверх</text>`),
      update(svg, value) {
        const p = clamp(value), distance = 142 * p;
        set(svg, 'roller', 'transform', `translate(0 ${-distance})`);
        set(svg, 'paint', 'y', 220 - distance);
        set(svg, 'paint', 'height', distance);
      }
    }
  ];
})();
