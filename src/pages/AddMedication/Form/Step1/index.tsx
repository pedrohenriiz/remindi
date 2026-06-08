import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from '../../../../theme/ThemeProvider';
import { RootStackParamList } from '../../../../navigation/types';
import { MedicationFormData } from '../../validationSchema';
import { Header } from '../../../../components/Header';
import { StepIndicator } from '../../../../components/StepIndicator';
import { Icon, IconName } from '../../../../components/Common/Icon';
import { MedicationType } from '../../../../types/medicationType';
import { Button } from '../../../../components/Common/Button';
import { Input } from '../../../../components/Common/Input';

type MedicationTypeOption = {
  type: MedicationType;
  label: string;
  icon: IconName;
};

const MEDICATION_TYPES: MedicationTypeOption[] = [
  { type: 'tablet', label: 'Comprimido', icon: 'Pill' },
  { type: 'capsule', label: 'Cápsula', icon: 'PillBottle' },
  { type: 'liquid', label: 'Líquido', icon: 'Droplet' },
  { type: 'other', label: 'Outro', icon: 'AlertCircle' },
];

const unitByType: Record<MedicationType, string> = {
  tablet: 'comprimido(s)',
  capsule: 'cápsula(s)',
  liquid: 'ml',
  other: 'unidade(s)',
};

interface Step1Props {
  onNext: () => void;
}

// @TODO: Refatorar essa página
export function Step1({ onNext }: Step1Props) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, typography } = theme;

  const {
    control,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext<MedicationFormData>();

  const selectedType = watch('type');

  async function handleNext() {
    const isValid = await trigger(['name', 'amount', 'type']);
    if (isValid) onNext();
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background.primary }}
      edges={['top', 'bottom']}
    >
      <Header showBackButton />

      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}
        showsVerticalScrollIndicator={false}
      >
        <StepIndicator totalSteps={2} currentStep={1} />

        <View style={{ gap: spacing.xs }}>
          <Text
            style={{
              fontSize: typography.sizes.caption,
              fontWeight: typography.weights.semibold,
              color: colors.text.secondary,
              textTransform: 'uppercase',
              letterSpacing: 0.6,
            }}
          >
            Etapa 1 de 2
          </Text>
          <Text
            style={{
              fontSize: typography.sizes.headline,
              fontWeight: typography.weights.bold,
              color: colors.text.primary,
            }}
          >
            Sobre o medicamento
          </Text>
          <Text
            style={{
              fontSize: typography.sizes.label,
              color: colors.text.secondary,
            }}
          >
            Informações básicas do remédio.
          </Text>
        </View>

        <Controller
          control={control}
          name='name'
          render={({ field: { onChange, value } }) => (
            <Input.Root>
              <Input.Label>Nome do medicamento</Input.Label>

              <Input.FormControl>
                <Input.Input
                  value={value}
                  onChangeText={onChange}
                  placeholder='Ex: Glicinato de Magnésio'
                  autoCapitalize='words'
                  testID='medication-name'
                />
              </Input.FormControl>

              <Input.Error error={errors.name?.message} />
            </Input.Root>
          )}
        />

        <Controller
          control={control}
          name='amount'
          render={({ field: { onChange, value } }) => (
            <Input.Root>
              <Input.Label>Dosagem</Input.Label>

              <Input.FormControl>
                <Input.Input
                  value={value}
                  onChangeText={onChange}
                  placeholder='Ex: 500mg'
                  autoCapitalize='words'
                  testID='medication-dose'
                />
              </Input.FormControl>

              <Input.Error error={errors.amount?.message} />
            </Input.Root>
          )}
        />

        <View style={{ gap: spacing.sm }}>
          <Input.Label>Tipo</Input.Label>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: spacing.sm,
            }}
          >
            {MEDICATION_TYPES.map((option) => {
              const isSelected = selectedType === option.type;

              return (
                <TouchableOpacity
                  key={option.type}
                  onPress={() => {
                    setValue('type', option.type);
                    setValue('unit', unitByType[option.type]);
                  }}
                  activeOpacity={0.7}
                  style={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flex: 1,
                    gap: spacing.xs,
                    padding: spacing.sm,
                    borderRadius: borderRadius.lg,
                    borderWidth: 1.5,
                    borderColor: isSelected
                      ? colors.primary[500]
                      : colors.border.default,
                    backgroundColor: isSelected
                      ? colors.primary[50]
                      : colors.background.primary,
                  }}
                  testID={`dose-type-${option.type}`}
                  accessibilityLabel={`type-${option.type}`}
                  accessibilityState={{ selected: isSelected }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: borderRadius.full,
                      backgroundColor: isSelected
                        ? colors.primary[100]
                        : colors.background.secondary,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon
                      name={option.icon}
                      size={20}
                      color={
                        isSelected ? colors.primary[500] : colors.text.secondary
                      }
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: typography.sizes.caption,
                      fontWeight: typography.weights.semibold,
                      color: isSelected
                        ? colors.primary[600]
                        : colors.text.secondary,
                      textAlign: 'center',
                    }}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View
        style={{
          padding: spacing.lg,
        }}
      >
        <Button.Root
          size='lg'
          onPress={handleNext}
          testID='button-continue'
          fullWidth
        >
          <Button.Label>Continuar</Button.Label>
        </Button.Root>
      </View>
    </SafeAreaView>
  );
}
