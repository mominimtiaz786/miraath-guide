"""
ISLAMIC INHERITANCE CALCULATOR (Sunni / majority view)
=======================================================
Written as an explicit if/else decision tree so you can READ the rules.

Uses Python's Fraction class so shares are exact (no floating point errors).

SIMPLIFICATIONS (noted where relevant):
- Handles the most common heirs: spouse, betay, betiyaan, baap, maa,
  grandfather, grandmother, son's children, full/paternal/maternal siblings,
  paternal uncles, nephews.
- Grandfather-with-siblings uses the Hanafi view (grandfather blocks siblings).
- Radd (return of surplus) excludes the spouse (majority view).
- This is EDUCATIONAL. Real estates need a qualified scholar / local law.
"""

from fractions import Fraction as F


def calculate_inheritance(
    maiyyat,        # "male" or "female"
    shohar=False,          # only if deceased is female
    biwiyaan=0,                # 0-4, only if deceased is male
    betay=0,
    betiyaan=0,
    potay=0,            # grandsons through a son
    potiyaan=0,       # granddaughters through a son
    baap=False,
    maa=False,
    dada=False,
    dadiyan_naniyan=0,         # maternal and/or paternal grandmother (1 or 2)
    saggay_bhai=0,
    saggi_behnen=0,
    soteyly_bhai_baap_se=0,
    soteli_behne_baap_se=0,
    sotely_behen_bhai_maa_se=0,   # brothers and sisters share equally
    saggay_bhateejy=0,             # full brother's betay
    chacha_taya=0,          # baap's full brothers
    chacha_taya_zaad=0,              # cousins
):
    shares = {}          # heir -> Fraction of estate
    notes = []           # explanation log

    # ----------------------------------------------------------------
    # STEP 0: derived facts used everywhere in the tree
    # ----------------------------------------------------------------
    aulaad_hai = (betay + betiyaan) > 0
    mard_nasal_hai = betay > 0 or potay > 0
    nasal_hai = aulaad_hai or potay > 0 or potiyaan > 0
    azwaaj_hai = bool(shohar or biwiyaan)

    # Grandfather only counts if baap is dead (baap blocks him)
    if baap:
        dada = False

    # For sibling-share rules, "baap figure" blocks siblings.
    # Hanafi view: grandfather ALSO blocks all siblings.
    father_figure = baap or dada

    total_saggay_behen_bhai = saggay_bhai + saggi_behnen
    total_soteyly_behen_bhai_baap_se = soteyly_bhai_baap_se + soteli_behne_baap_se
    total_soteyly_behen_bhai = total_soteyly_behen_bhai_baap_se + sotely_behen_bhai_maa_se

    # Count siblings for the maa's 1/6 rule (any two or more siblings)
    total_behen_bhai = (total_saggay_behen_bhai + total_soteyly_behen_bhai)

    # ================================================================
    # PART 1: FIXED SHARES (Ashab al-Furud)
    # ================================================================

    waliden_hen = maa or baap
    waliden_figure_hen = bool(waliden_hen or dada or dadiyan_naniyan)


    # ---------- SPOUSE ----------
    if azwaaj_hai:
        if maiyyat == "female":
            if shohar:
                if nasal_hai:
                    shares["shohar"] = F(1, 4)
                    notes.append("shohar: 1/4 (deceased has descendants)")
                else:
                    shares["shohar"] = F(1, 2)
                    notes.append("shohar: 1/2 (no descendants)")
        else:  # deceased is male
            if biwiyaan > 0:
                if nasal_hai:
                    shares["biwiyaan (total)"] = F(1, 8)
                    notes.append(f"Wife/biwiyaan: 1/8 shared by {biwiyaan} (has descendants)")
                else:
                    shares["biwiyaan (total)"] = F(1, 4)
                    notes.append(f"Wife/biwiyaan: 1/4 shared by {biwiyaan} (no descendants)")


    if waliden_figure_hen:
        if waliden_hen:
            # ---------- maa ----------
            if maa:
                if nasal_hai or total_behen_bhai >= 2:
                    shares["maa"] = F(1, 6)
                    notes.append("maa: 1/6 (descendants exist, or 2+ siblings)")
                else:
                    # Check for the Umariyyatan special case:
                    # deceased leaves ONLY spouse + baap + maa
                    if azwaaj_hai and baap and total_behen_bhai == 0:
                        # maa gets 1/3 of what REMAINS after the spouse,
                        # not 1/3 of the whole estate (Caliph Umar's ruling)
                        spouse_share = shares.get("shohar", shares.get("biwiyaan (total)", F(0)))
                        shares["maa"] = (F(1) - spouse_share) * F(1, 3)
                        notes.append("maa: 1/3 of REMAINDER after spouse (Umariyyatan case)")
                    else:
                        shares["maa"] = F(1, 3)
                        notes.append("maa: 1/3 (no descendants, fewer than 2 siblings)")

            if baap:
                if mard_nasal_hai:
                    shares["baap"] = F(1, 6)
                    notes.append("baap: 1/6 only (a son/grandson exists)")
                elif nasal_hai:  # only female descendants
                    shares["baap"] = F(1, 6)
                    notes.append("baap: 1/6 + any residue (only female descendants)")
                else:
                    notes.append("baap: takes residue as closest male heir (no descendants)")


        # ---------- GRANDMOTHER(S) ----------
        if not maa and dadiyan_naniyan:
            shares["grandmother(s)"] = F(1, 6)
            notes.append("Grandmother(s): 1/6 shared (maa is dead)")

        # ---------- baap (fixed portion; residue handled in Part 2) ----------

        if not baap and dada:
            # Grandfather steps into baap's role
            if mard_nasal_hai:
                shares["grandfather"] = F(1, 6)
                notes.append("Grandfather: 1/6 only (a son/grandson exists)")
            elif nasal_hai:
                shares["grandfather"] = F(1, 6)
                notes.append("Grandfather: 1/6 + residue (only female descendants)")
            else:
                notes.append("Grandfather: takes residue (no descendants)")


    if not betay:
        # ---------- betiyaan (only when NO son; with a son they're residuary) ----------
        if betiyaan:
            if betiyaan == 1:
                shares["daughter"] = F(1, 2)
                notes.append("One daughter: 1/2")
            else:
                shares["betiyaan (total)"] = F(2, 3)
                notes.append(f"{betiyaan} betiyaan: 2/3 shared")

        if not potay:
            # ---------- SON'S betiyaan ----------
            if potiyaan > 0:
                if not betiyaan:
                    if potiyaan == 1:
                        shares["son's daughter"] = F(1, 2)
                        notes.append("Son's daughter: 1/2 (acts like a daughter)")
                    else:
                        shares["son's betiyaan (total)"] = F(2, 3)
                        notes.append("Son's betiyaan: 2/3 shared")
                elif betiyaan == 1:
                    shares["son's daughter(s)"] = F(1, 6)
                    notes.append("Son's daughter(s): 1/6 (completes 2/3 with one daughter)")
                else:
                    notes.append("Son's betiyaan: BLOCKED (two+ betiyaan used up the 2/3)")


            if not nasal_hai and not father_figure: 
                # ---------- MATERNAL HALF-SIBLINGS (kalalah only) ----------
                if sotely_behen_bhai_maa_se:
                    if sotely_behen_bhai_maa_se == 1:
                        shares["maternal half-sibling"] = F(1, 6)
                        notes.append("One maternal half-sibling: 1/6")
                    else:
                        shares["maternal half-siblings (total)"] = F(1, 3)
                        notes.append("Maternal half-siblings: 1/3 shared EQUALLY (male=female)")


                if not saggay_bhai:
                    # ---------- FULL SISTERS (fixed share only when no full brother) ----------
                    sisters_get_fixed = saggi_behnen > 0
                    if sisters_get_fixed:
                        # Special: with betiyaan present, sisters become residuary instead
                        if betiyaan or potiyaan:
                            sisters_get_fixed = False   # handled in residue as "asabah ma'a al-ghayr"
                        elif saggi_behnen == 1:
                            shares["full sister"] = F(1, 2)
                            notes.append("One full sister: 1/2")
                        else:
                            shares["full sisters (total)"] = F(2, 3)
                            notes.append(f"{saggi_behnen} full sisters: 2/3 shared")

                    if not soteyly_bhai_baap_se: 
                        # ---------- PATERNAL HALF-SISTERS ----------
                        if soteli_behne_baap_se:
                            if not saggi_behnen:
                                if soteli_behne_baap_se == 1:
                                    shares["paternal half-sister"] = F(1, 2)
                                    notes.append("One paternal half-sister: 1/2")
                                else:
                                    shares["paternal half-sisters (total)"] = F(2, 3)
                                    notes.append("Paternal half-sisters: 2/3 shared")
                            elif saggi_behnen == 1:
                                shares["paternal half-sister(s)"] = F(1, 6)
                                notes.append("Paternal half-sister(s): 1/6 (completes 2/3)")
                            else:
                                notes.append("Paternal half-sisters: BLOCKED (two+ full sisters)")

    # ================================================================
    # PART 2: RESIDUE (Asabah) — who gets what's left, in priority order
    # ================================================================
    used = sum(shares.values())
    residue = F(1) - used

    if residue > 0:
        # --- Priority 1: betay (betiyaan join them at 2:1) ---
        if betay > 0:
            units = betay * 2 + betiyaan
            if betiyaan > 0:
                shares["betay (total)"] = residue * F(betay * 2, units)
                shares["betiyaan (total)"] = residue * F(betiyaan, units)
                notes.append(f"Residue -> {betay} son(s) & {betiyaan} daughter(s), "
                             "each son gets double each daughter")
            else:
                shares["betay (total)"] = residue
                notes.append(f"Residue -> {betay} son(s) equally")
            residue = F(0)

        # --- Priority 2: SON'S betay (son's betiyaan join at 2:1) ---
        elif potay > 0:
            units = potay * 2 + potiyaan
            if potiyaan > 0:
                shares["son's betay (total)"] = residue * F(potay * 2, units)
                shares["son's betiyaan (total)"] = residue * F(potiyaan, units)
            else:
                shares["son's betay (total)"] = residue
            notes.append("Residue -> grandsons (granddaughters join at 2:1)")
            residue = F(0)

        # --- Priority 3: baap / GRANDFATHER ---
        elif father_figure:
            key = "baap" if baap else "grandfather"
            shares[key] = shares.get(key, F(0)) + residue
            notes.append(f"Residue -> {key}")
            residue = F(0)

        # --- Priority 4: FULL BROTHERS (full sisters join at 2:1) ---
        elif saggay_bhai > 0:
            units = saggay_bhai * 2 + saggi_behnen
            if saggi_behnen > 0:
                shares["full brothers (total)"] = residue * F(saggay_bhai * 2, units)
                shares["full sisters (total)"] = residue * F(saggi_behnen, units)
            else:
                shares["full brothers (total)"] = residue
            notes.append("Residue -> full brothers (sisters join at 2:1)")
            residue = F(0)

        # --- Priority 4b: FULL SISTERS with betiyaan (asabah ma'a al-ghayr) ---
        elif (saggi_behnen > 0 and (betiyaan > 0 or potiyaan > 0)):
            shares["full sisters (residue)"] = residue
            notes.append("Residue -> full sisters (become residuary WITH betiyaan)")
            residue = F(0)

        # --- Priority 5: PATERNAL HALF-BROTHERS ---
        elif soteyly_bhai_baap_se > 0:
            units = soteyly_bhai_baap_se * 2 + soteli_behne_baap_se
            if soteli_behne_baap_se > 0:
                shares["paternal half-brothers (total)"] = residue * F(soteyly_bhai_baap_se * 2, units)
                shares["paternal half-sisters (total)"] = residue * F(soteli_behne_baap_se, units)
            else:
                shares["paternal half-brothers (total)"] = residue
            notes.append("Residue -> paternal half-brothers")
            residue = F(0)

        # --- Priority 6: NEPHEWS (full brother's betay) ---
        elif saggay_bhateejy > 0:
            shares["nephews (total)"] = residue
            notes.append("Residue -> full brothers' betay")
            residue = F(0)

        # --- Priority 7: PATERNAL UNCLES ---
        elif chacha_taya > 0:
            shares["paternal uncles (total)"] = residue
            notes.append("Residue -> paternal uncles")
            residue = F(0)

        # --- Priority 8: UNCLES' betay (cousins) ---
        elif chacha_taya_zaad > 0:
            shares["cousins (total)"] = residue
            notes.append("Residue -> paternal cousins")
            residue = F(0)

    # ================================================================
    # PART 3: AWL — shares exceed the estate -> scale everything down
    # ================================================================
    total = sum(shares.values())
    if total > 1:
        notes.append(f"AWL applied: shares totalled {total}, all scaled down proportionally")
        for k in shares:
            shares[k] = shares[k] / total

    # ================================================================
    # PART 4: RADD — surplus remains and no residuary -> return it
    #          to fixed-share heirs proportionally (EXCLUDING spouse)
    # ================================================================
    total = sum(shares.values())
    if total < 1 and shares:
        surplus = F(1) - total
        radd_heirs = {k: v for k, v in shares.items()
                      if k not in ("shohar", "biwiyaan (total)")}
        if radd_heirs:
            base = sum(radd_heirs.values())
            for k in radd_heirs:
                shares[k] += surplus * (radd_heirs[k] / base)
            notes.append("RADD applied: surplus returned to blood heirs proportionally")
        else:
            notes.append(f"Surplus of {surplus} -> Bayt al-Mal (public treasury) "
                         "or distant kindred")

    return shares, notes


def print_result(title, shares, notes, estate=None):
    print("=" * 60)
    print(title)
    print("=" * 60)
    for n in notes:
        print("  *", n)
    print("-" * 60)
    for heir, frac in shares.items():
        line = f"  {heir:<32} {str(frac):>8}  ({float(frac)*100:.2f}%)"
        if estate:
            line += f"  = {float(frac)*estate:,.0f}"
        print(line)
    print(f"  {'TOTAL':<32} {str(sum(shares.values())):>8}")
    print()


# ====================================================================
# DEMO SCENARIOS
# ====================================================================
if __name__ == "__main__":

    # 1. Classic: man dies, leaves wife, 2 betay, 1 daughter, both parents
    s, n = calculate_inheritance("male", biwiyaan=1, betay=2, betiyaan=1,
                                 baap=True, maa=True)
    print_result("1) Man leaves: wife, 2 betay, 1 daughter, baap, maa",
                 s, n, estate=1_000_000)

    # 2. Woman dies, leaves shohar and 2 betiyaan (no betay), maa
    s, n = calculate_inheritance("female", shohar=True, betiyaan=2, maa=True)
    print_result("2) Woman leaves: shohar, 2 betiyaan, maa", s, n)

    # 3. AWL case: shohar + 2 full sisters (shares = 1/2 + 2/3 = 7/6 > 1)
    s, n = calculate_inheritance("female", shohar=True, saggi_behnen=2)
    print_result("3) AWL: shohar + 2 full sisters", s, n)

    # 4. Umariyyatan: wife + baap + maa
    s, n = calculate_inheritance("male", biwiyaan=1, baap=True, maa=True)
    print_result("4) Umariyyatan: wife + baap + maa", s, n)

    # 5. RADD: only maa + 1 daughter
    s, n = calculate_inheritance("male", maa=True, betiyaan=1)
    print_result("5) RADD: maa + 1 daughter only", s, n)

    # 6. No close heirs: only paternal uncles
    s, n = calculate_inheritance("male", biwiyaan=1, chacha_taya=2)
    print_result("6) Wife + 2 paternal uncles only", s, n)

    # 7. Kalalah: maternal half-siblings + full brother
    s, n = calculate_inheritance("female", shohar=True, maa=True,
                                 sotely_behen_bhai_maa_se=2, saggay_bhai=1)
    print_result("7) Kalalah: shohar, maa, 2 maternal half-sibs, full brother",
                 s, n)





"""
1. ask gender
2. ask spouse
3. ask any descendants alive (betay, betiyaan, potay, potiyaan)
4. ask if father
5. else ask grandfather
6. ask mother
    a) if no descendants, ask siblings count (full + half - step siblings)
7. else ask grandmother(s)
8. ask sons
    a) ask daughters
9. else ask grandsons
    a) ask granddaughters
10. if no descendants, no father/grandfather, 
    a) ask maternal half-siblings count
    b) ask full brothers count
        - ask full sisters count
        

"""